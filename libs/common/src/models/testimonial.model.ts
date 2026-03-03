import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity()
export class Testimonial {
	@PrimaryGeneratedColumn({
		type: 'bigint',
	})
	id: number;

	@Column({
		nullable: true,
		default: '',
	})
	author: string;

	@Column({
		nullable: true,
		default: '',
	})
	avatarUrl: string;

	@Column({
		nullable: true,
		default: '',
	})
	testimonial: string;

	@Column({
		nullable: true,
		default: '',
	})
	age: string;

	@Column({
		default: '',
		nullable: true,
	})
	handle: string;

	@Column({
		default: '',
		nullable: true,
	})
	platform: string;

	@CreateDateColumn()
	createdAt: Date;
}

export class TestimonialInfo {
	@ApiProperty({
		description: 'The ID of the testimonial',
		example: '1',
		type: String,
	})
	id: string;

	@ApiProperty({
		description: 'The author of the testimonial',
		example: 'John Doe',
		type: String,
	})
	author: string;

	@ApiProperty({
		description: 'The avatar URL of the testimonial',
		example: 'https://example.com/avatar.png',
		type: String,
	})
	avatarUrl: string;

	@ApiProperty({
		type: String,
		example: '25 Years',
		description: 'The age of the user',
	})
	age: string;

	@ApiProperty({
		description: 'The testimonial',
		example: 'This is a testimonial',
		type: String,
	})
	testimonial: string;

	@ApiProperty({
		description: 'The handle of the user',
		example: '@johndoe',
		type: String,
	})
	handle: string;

	@ApiProperty({
		description: 'The platform of the user',
		example: 'Instagram',
		type: String,
	})
	platform: string;

	@ApiProperty({
		description: 'The created at date of the testimonial',
		example: '2021-01-01',
		type: Date,
	})
	createdAt: Date;
}
