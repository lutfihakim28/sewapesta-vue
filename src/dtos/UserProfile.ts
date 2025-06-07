import { Location } from './Location';
import { User } from './User';

export class UserProfile extends User {
  address?: string;
  phone: string;
  name: string;
  location: Location

  constructor(data: UserProfile) {
    super(data);
    if (data.address) this.address = data.address;
    this.phone = data.phone;
    this.name = data.name;
    this.location = new Location(data.location)
  }
}
