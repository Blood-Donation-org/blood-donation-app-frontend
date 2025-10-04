const users = [
  {
    id: 1,
    username: "adminUser",
    password: "admin123",
    name: "Alice Admin",
    email: "alice@admin.com",
    role: "admin" // redirect to /admin
  },
  {
    id: 2,
    username: "managerUser",
    password: "manager123",
    name: "Bob Manager",
    email: "bob@manager.com",
    role: "user" // redirect to /manager
  },
  {
    id: 3,
    username: "basicUser1",
    password: "user123",
    name: "Charlie User",
    email: "charlie@user.com",
    role: "user" // redirect to /user
  },
  {
    id: 4,
    username: "basicUser2",
    password: "user456",
    name: "Dana User",
    email: "dana@user.com",
    role: "user" // redirect to /user
  }
];

export default users;
