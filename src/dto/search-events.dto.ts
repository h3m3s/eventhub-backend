import { IsOptional, IsString, MaxLength } from 'class-validator';

export class SearchEventsDto {
    @IsOptional()
    @IsString()
    @MaxLength(100)
    q?: string;
}