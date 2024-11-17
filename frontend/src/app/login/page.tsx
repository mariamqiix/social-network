'use client';

import { useEffect, useState } from "react";
import Card from "../components/card";
import { colors } from "../components/colors";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { login } from "../redux/actions";
import { selectNotifications, selectUser } from "../redux/selectors";
import Metadata from "../components/Metadata";

const color = colors[0];
export default function loginPage() {
    const user = useSelector(selectUser);

    const dispatch = useDispatch();
    const router = useRouter()
    let [isRegister, setIsRegister] = useState(true);
    return isRegister ? <Card title="Login" color={color}>
        <Metadata seoTitle="Friendz | Login" seoDescription="The next gen social network" />
        <form className="d-flex flex-column" onSubmit={(e) => {
            e.preventDefault();
            let formData = new FormData(e.target as HTMLFormElement);
            fetch("http://localhost:8080/login",
                { method: "POST", credentials: 'include', body: formData }).then(res => {
                    if (res.ok && formData.get("username")) {
                        res.json().then(data => {
                            // console.log(data);
                            dispatch(login({ id: data.ID, username: data.Username, firstName: data.FirstName, lastName: data.LastName, email: data.Email, image: data.ImageID, dob: data.DateOfBirth, bio: data.Bio }));
                            router.replace("/");
                        });
                    }
                });
        }}>
            {/* <h3 className="text-center">Please enter your login details</h3> */}
            <div className="mb-3">
                <label className="form-label">User name</label>
                <input required type="text" className="form-control" name="username" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label className="form-label">Password</label>
                <input required type="password" className="form-control" name="password" />
            </div>
            <span>
                Don't have an account yet? <a href="#" onClick={() => {
                    setIsRegister(false);
                }}>Register</a>
            </span>
            <button type="submit" className="btn btn-dark mt-3">Login</button>
        </form>
    </Card > : <Card title="Register" color={color}>
        <Metadata seoTitle="Friendz | Register" seoDescription="The next gen social network" />
        <form className="d-flex flex-column">
            {/* <h3 className="text-center">Please enter your account details</h3> */}
            <div className="mb-3">
                <label className="form-label">Email</label>
                <div id="usernameHelp" style={{ color: "red", fontSize: "0.875rem" }}>Your email must contain @.</div>
                <input type="email" className="form-control" name="email" aria-describedby="emailHelp" />
            </div>
            <div className="mb-3">
                <label className="form-label">User name</label>
                <div id="usernameHelp" style={{ color: "red", fontSize: "0.875rem" }}>{/*Your username must be between 6 and 12 characters.*/}</div>
                <input type="text" className="form-control" name="username" aria-describedby="usernameHelp" />
            </div>

            <div className="mb-3">
                <label className="form-label">First name</label>
                <input type="text" className="form-control" name="firstName" aria-describedby="firstNameHelp" />
            </div>

            <div className="mb-3">
                <label className="form-label">Last name</label>
                <input type="text" className="form-control" name="firstName" aria-describedby="lastNameHelp" />
            </div>

            <div className="mb-3">
                <label className="form-label">Date of birth</label>
                <input
                    type="date"
                    className="form-control"
                    name="dob"
                    aria-describedby="dobHelp"
                    max={new Date().toISOString().split("T")[0]} />{/** Restrict to dates before today */}
            </div>

            <div className="mb-3">
                <label className="form-label">Avatar</label>
                <input
                    type="file"
                    className="form-control"
                    name="avatar"
                    aria-describedby="avatarHelp"
                    accept="image/*" /> {/* Only allows image files */}

                <small id="avatarHelp" className="form-text text-muted">
                    Please upload an image file (e.g., .jpg, .png).
                </small>
            </div>

            <div className="mb-3">
                <label className="form-label">About Me</label>
                <textarea
                    className="form-control"
                    name="aboutMe"
                    aria-describedby="aboutMeHelp"
                    rows={4} // Adjust the number of rows as needed
                ></textarea>
                <small id="aboutMeHelp" className="form-text text-muted">
                    Tell us a little about yourself.
                </small>
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