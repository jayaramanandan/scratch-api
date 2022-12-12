interface UserLoginResponse {
  username: string;
  token: string;
  num_tries: number;
  success: number;
  msg: string;
  messages: string[];
  id: number;
}

export default UserLoginResponse;
