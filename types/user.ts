interface User {
  _id: string;
  username: string;
  email: string;
  password: string;
}

type RequestUser = Omit<User, "password">;
type BodyUser = Omit<User, "_id">;


export { User, RequestUser, BodyUser };
