export enum Roles {
  // Quyền hệ thống
  SYSTEM_ADMIN = 'SYSTEM_ADMIN', // Quản trị viên toàn hệ thống

  // Quyền người dùng
  USER = 'USER', // Người dùng có thể mở các quán ăn
  CUSTOMER = 'CUSTOMER', // Người dùng đăng nhập để đặt món

  // Quyền trong từng quán ăn
  RESTAURANT_MANAGER = 'RESTAURANT_MANAGER', // Quản lý nhà hàng
  RESTAURANT_STAFF = 'RESTAURANT_STAFF', // Nhân viên phục vụ
  RESTAURANT_CHEF = 'RESTAURANT_CHEF', // Nhân viên nhà bếp
}
