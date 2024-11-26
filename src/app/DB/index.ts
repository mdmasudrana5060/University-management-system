import config from '../config';
import { USER_ROLE } from '../modules/User/user.constant';
import { User } from '../modules/User/user.model';

const superUser = {
  id: 'SA-001',
  email: 'ranam5060@gmail.com',
  password: config.super_admin_password,
  needsPasswordChange: false,
  role: USER_ROLE.superAdmin,
  status: 'in-progress',
  isDeleted: false,
};
const seedSuperAdmin = async () => {
  // when database is connected we have to any super admin is in database
  const isSuperAdminExists = await User.findOne({ role: USER_ROLE.superAdmin });
  if (!isSuperAdminExists) {
    await User.create(superUser);
  }
};
export default seedSuperAdmin;

/*{
  "id": "SA-001",
  "password":"super-admin-12345"
} */
