import {
	Entity,
	Column,
	CreateDateColumn,
	PrimaryGeneratedColumn,
} from 'typeorm';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

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
	@ApiPropertyOptional({
		description: 'The ID of the testimonial',
		example: '1',
		type: String,
	})
	id: string;

	@ApiPropertyOptional({
		description: 'The author of the testimonial',
		example: 'John Doe',
		type: String,
	})
	author: string;

	@ApiPropertyOptional({
		description: 'The avatar URL of the testimonial',
		example: 'https://example.com/avatar.png',
		type: String,
	})
	avatarUrl: string;

	@ApiPropertyOptional({
		type: String,
		example: '25 Years',
		description: 'The age of the user',
	})
	age: string;

	@ApiPropertyOptional({
		description: 'The testimonial',
		example: 'This is a testimonial',
		type: String,
	})
	testimonial: string;

	@ApiPropertyOptional({
		description: 'The handle of the user',
		example: '@johndoe',
		type: String,
	})
	handle: string;

	@ApiPropertyOptional({
		description: 'The platform of the user',
		example: 'Instagram',
		type: String,
	})
	platform: string;

	@ApiPropertyOptional({
		description: 'The created at date of the testimonial',
		example: '2021-01-01',
		type: Date,
	})
	createdAt: Date;
}
