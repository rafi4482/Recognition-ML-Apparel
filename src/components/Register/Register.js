import React, { useState } from "react";
import { toast, Toaster } from "react-hot-toast";

const Register = ({ onRouteChange, loadUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onNameChange = (event) => {
    setName(event.target.value);
  };

  const onEmailChange = (event) => {
    setEmail(event.target.value);
  };

  const onPasswordChange = (event) => {
    setPassword(event.target.value);
  };

  const onSubmitRegister = async () => {
    if (email.length === 0 || password.length === 0) {
      toast.error("Email and password are required");
      return;
    }

    if (password.length < 6) {
      toast.error("Password should be at least 6 characters long");
      return;
    }

    try {
      const response = await fetch(
        "http://recognition-ml-apparel-server-7qpz.vercel.app//register",
        {
          method: "post",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            name: name,
            email: email,
            password: password,
          }),
        }
      );

      const user = await response.json();

      if (response.ok && user) {
        loadUser(user);
        onRouteChange("home");
        toast.success("Registration successful");
      } else {
        toast.error("Email already exists");
      }
    } catch (error) {
      console.log(error);
      toast.error("An error occurred");
    }
  };

  return (
    <>
      <h1 style={{ marginBottom: 110 }}>
        Unlock Your World with Face Recognition!
      </h1>
      <Toaster></Toaster>
      <article className="mt4 br3 ba b--black-10 mv4 w-100 w-50-m w-25-l mw6 shadow-5 center">
        <main className="pa4 black-80">
          <div className="measure">
            <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
              <legend className="f1 fw6 ph0 mh0">Register</legend>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="name">
                  Name
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="text"
                  name="name"
                  id="name"
                  onChange={onNameChange}
                />
              </div>
              <div className="mt3">
                <label className="db fw6 lh-copy f6" htmlFor="email-address">
                  Email
                </label>
                <input
                  className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="email"
                  name="email-address"
                  id="email-address"
                  onChange={onEmailChange}
                />
              </div>
              <div className="mv3">
                <label className="db fw6 lh-copy f6" htmlFor="password">
                  Password
                </label>
                <input
                  className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100"
                  type="password"
                  name="password"
                  id="password"
                  onChange={onPasswordChange}
                />
              </div>
            </fieldset>
            <div className="">
              <input
                onClick={onSubmitRegister}
                className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib"
                type="submit"
                value="Register"
              />
            </div>
          </div>
        </main>
      </article>
    </>
  );
};

export default Register;
