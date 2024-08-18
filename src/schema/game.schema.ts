import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

@Schema()
export class Game {
  @Prop({ required: true })
  name: string;

  @Prop({ default: 0 })
  price: number;

  @Prop({ default: new Date().toISOString() })
  added: string;

  @Prop({ default: 0 })
  rating: number;

  @Prop({ default: 'n/a' })
  place: string;

  @Prop({ default: 'n/a' })
  lastPlay: string;
}

export type GameDocument = HydratedDocument<Game>;
export const GameSchema = SchemaFactory.createForClass(Game);
