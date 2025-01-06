const prisma = require(".");

const seed = async () => {
  const createUsers = async () => {
    const users = [
      { username: "Sam", password: "password1" },
      { username: "Curt", password: "password2" },
      { username: "Priyanka", password: "password3" }
    ];
    await prisma.user.createMany({ data: users });
  };

  const createPosts = async () => {
    const posts = [
      { userId: 1, body: "Post 1" },
      { userId: 2, body: "Post 2" },
      { userId: 2, body: "Post 3" },
      { userId: 3, body: "Post 4" },
      { userId: 3, body: "Post 5" }
    ];
    await prisma.post.createMany({ data: posts });
  };

  await createUsers();
  await createPosts();
};
seed()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
