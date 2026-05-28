import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';

import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>
  ) { }

  async create(createUserDto: CreateUserDto) {

    const existingUser = await this.userRepository.findOneBy({
      email: createUserDto.email
    })

    if (existingUser) {
      throw new BadRequestException(
        'El email ya está registrado'
      )
    }

    // Encriptar la contraseña
    const hashedPassword = await bcrypt.hash(
      createUserDto.password,
      10,
    )

    const user = this.userRepository.create({
      ...createUserDto,
      password: hashedPassword
    });

    return this.userRepository.save(user);
  }

  findAll() {
    return this.userRepository.find();
  }

  async findOne(id: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ id });

    if (!user) {
      throw new NotFoundException(
        `El user con Id ${id} no se encuentra de la BD`,
      );
    }

    return user;
  }

  async findOneByEmail(email: string): Promise<User> {
    const user = await this.userRepository.findOneBy({ email });

    if (!user) {
      throw new NotFoundException(
        `El user con Id ${email} no se encuentra de la BD`,
      );
    }

    return user;
  }

  async update(id: string, updateUserDto: UpdateUserDto) {

    const user = await this.findOne(id);

    // Validar email repetido
    if (
      updateUserDto.email &&
      updateUserDto.email !== user.email
    ) {

      const existingUser = await this.userRepository.findOneBy({
        email: updateUserDto.email,
      });

      if (existingUser) {
        throw new BadRequestException(
          'El email ya está registrado',
        );
      }
    }

    // Encriptar password si viene
    if (updateUserDto.password) {
      updateUserDto.password = await bcrypt.hash(
        updateUserDto.password,
        10,
      );
    }

    Object.assign(user, updateUserDto);

    return this.userRepository.save(user);
  }

  async remove(id: string) {
    const result = await this.userRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`El user con ID ${id} no se encuentra de la BD`)
    }

  }
}
