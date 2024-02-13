class Validator {
  static validateUser(body: any): {
    valid: boolean;
    message: string;
  } {
    let example = {
      username: "username",
      email: "email",
      password: "password",
    };
    let exampleKeys = Object.keys(example);
    let bodyKeys = Object.keys(body);

    let checkEqual = exampleKeys.every((key) => bodyKeys.includes(key));

    if (!checkEqual) {
      let messingFields = exampleKeys.filter((key) => !bodyKeys.includes(key));
      let extraFields = bodyKeys.filter((key) => !exampleKeys.includes(key));

      return {
        valid: false,
        message:
          messingFields.length > 0
            ? `Missing fields (${messingFields.join(",")})`
            : `Extra fields (${extraFields.join(",")})`,
      };
    }

    for (let key in example) {
      if (typeof body[key] !== typeof example[key as keyof typeof example]) {
        return {
          valid: false,
          message: `Invalid type for ${key}, expected ${typeof example[
            key as keyof typeof example
          ]} got ${typeof body[key]}`,
        };
      }
    }

    if (!this.validateEmail(body.email)) {
      return {
        valid: false,
        message: "Invalid Email",
      };
    }
    if (!this.validatePassword(body.password)) {
      return {
        valid: false,
        message: "Invalid Password",
      };
    }
    if (!this.validateUsername(body.username)) {
      return {
        valid: false,
        message: "Invalid Username",
      };
    }

    return {
      valid: true,
      message: "Valid User",
    };
  }

  static validateEmail(email: string): boolean {
    let regex = /^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/;
    return regex.test(email);
  }
  static validateUsername(username: string): boolean {
    let regex = /^[A-Za-z0-9-_]{3,16}$/;
    return regex.test(username);
  }

  static validatePassword(password: string): boolean {
    let regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{8,}$/;
    return regex.test(password);
  }

  static validateToken(token: string): boolean {
    let regex = /^Bearer [A-Za-z0-9-_]*\.[A-Za-z0-9-_]*\.[A-Za-z0-9-_]*$/;
    return regex.test(token);
  }
}

export { Validator };
