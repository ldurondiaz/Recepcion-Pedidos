import { v7 as uuidv7 } from 'uuid';
export class Uuid {
  public static generaId(): string {
    let id = uuidv7();
    return id;
  }
}
