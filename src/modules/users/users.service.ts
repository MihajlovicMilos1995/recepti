import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { SignUpDto } from 'src/models/user/signup.dto';
import { Roles } from 'src/entities/user/role-type.eum';
import { AuthCredentialsDto } from 'src/models/user/auth-credentials.dto';
import { JwtPayload } from 'src/common/jwt-payload.interface';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class UsersService {
  constructor(
    private jwtService: JwtService,
    private readonly configService: ConfigService,
    @InjectRepository(User)
    private userRepo: Repository<User>,
  ) {}

  async signUp(authCredentialsDto: SignUpDto): Promise<any> {
    let defaultRole;
    if (!authCredentialsDto.role) {
      defaultRole = Roles.USER;
    }

    await this.createUser(authCredentialsDto);

    const resp = await this.validateUserPassword(authCredentialsDto);

    if (!resp) {
      throw new UnauthorizedException('Error during user validation.');
    }

    const accessToken = await this.getAccessToken(resp);
    return { accessToken };
  }

  async createUser(userDto: SignUpDto): Promise<void> {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(userDto.password, salt);

    const user = new User();
    user.email = userDto.email.toLowerCase();
    user.password = hashedPassword;
    user.role = userDto.role;

    try {
      await this.userRepo.save(user);
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException(
          'The provided email or username is already in use',
        );
      } else {
        console.log(error);
        throw new InternalServerErrorException(
          'An error occurred while creating the user.',
        );
      }
    }
  }

  async validateUserPassword(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<JwtPayload> {
    const { email, password } = authCredentialsDto;
    const user = await this.userRepo.findOneBy({ email });

    if (user && (await user.validatePassword(password, user.password))) {
      if (user) {
        user.lastLogin = new Date();
        await this.userRepo.save(user);
      }
      return { id: user.id };
    } else {
      return null;
    }
  }

  private async getAccessToken(payload: JwtPayload): Promise<string> {
    const secret = this.configService.get<string>('JWT_SECRET');
    if (!secret) {
      throw new InternalServerErrorException('JWT configuration is missing.');
    }
    return this.jwtService.sign(payload, { secret });
  }

  async getUserById(id: string): Promise<User | null> {
    const user = await this.userRepo.findOneBy({ id });
    return user ? user : null;
  }

  async signIn(
    authCredentialsDto: AuthCredentialsDto,
  ): Promise<{ accessToken: string }> {
    const resp = await this.validateUserPassword(authCredentialsDto);
    console.log(resp);
    if (!resp) {
      throw new UnauthorizedException(
        'Creadentials are invalid. Please try again.',
      );
    }

    const accessToken = await this.getAccessToken(resp);

    return {
      accessToken,
    };
  }

  async whoami(user: User) {
    const respo = await this.userRepo
      .createQueryBuilder('user')
      .where('user.id = :id', { id: user?.id })
      .getOne();

    return {
      id: respo?.id,
      email: respo?.email,
      firstName: respo?.firstName,
      lastName: respo?.lastName,
      role: respo?.role,
    };
  }

  async deleteUser(id: string) {
    await this.userRepo.softDelete(id);
  }
}
