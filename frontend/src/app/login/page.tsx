'use client';

import { useEffect, useState } from "react";
import Card from "../components/card";
import { colors } from "../components/colors";
import { redirect, RedirectType } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions";
import { selectNotifications, selectUser } from "../redux/selectors";

const color = colors[0];
export default function loginPage() {
    const user = useSelector(selectUser);

    const dispatch = useDispatch();
    let [isRegister, setIsRegister] = useState(true);
    return isRegister ? <Card title="Login" color={color}>
        <form className="d-flex flex-column" onSubmit={(e) => {
            e.preventDefault();
            let formData = new FormData(e.target as HTMLFormElement);
            fetch("http://localhost:8080/login",
                { method: "POST", body: formData }).then(res => {
                    if (res.ok && formData.get("username")) {
                        res.json().then(data => {
                            console.log(data);
                            dispatch(login({ id: data.ID, username: data.Username, firstName: data.FirstName, lastName: data.LastName, email: data.Email, image: data.ImageID, dob: data.DateOfBirth, bio: data.Bio }));
                        });
                        // redirect('/chat', RedirectType.replace);
                    }
                });
        }}>
            {/* <h3 className="text-center">Please enter your login details</h3> */}
            <div className="mb-3">
                <label className="form-label">User name</label>
                <input type="text" className="form-control" name="username" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" />
            </div>
            <span>
                Don't have an account yet? <a href="#" onClick={() => {
                    setIsRegister(false);
                }}>Register</a>
            </span>
            <button type="submit" className="btn btn-dark mt-3">Login</button>
        </form>
    </Card> : <Card title="Register" color={color}>
        <form className="d-flex flex-column">
            {/* <h3 className="text-center">Please enter your account details</h3> */}
            <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" name="email" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label className="form-label">User name</label>
                <input type="text" className="form-control" name="username" aria-describedby="emailHelp" />
            </div>

            <div className="mb-3">
                <label className="form-label">Password</label>
                <input type="password" className="form-control" name="password" />
            </div>
            <span>
                Have an existing account <a href="#" onClick={() => {
                    setIsRegister(true);
                }}>Login</a>
            </span>
            <br />
            <button type="submit" className="btn btn-dark mt-3">Register</button>
        </form>
    </Card>;
}