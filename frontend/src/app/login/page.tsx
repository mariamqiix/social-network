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
    let [isLogin, setIsLogin] = useState(true);
    return isLogin ? <Card title="Login" color={color}>
        <Metadata seoTitle="Friendz | Login" seoDescription="The next gen social network" />
        <form className="d-flex flex-column" onSubmit={(e) => {
            e.preventDefault();
            let formData = new FormData(e.target as HTMLFormElement);
            fetch("http://127.0.0.1:8080/login",
                { method: "POST", credentials: 'include', body: formData }).then(res => {
                    if (res.ok && formData.get("username")) {
                        res.json().then(data => {
                            // dispatch(login({ id: data.ID, username: data.Username, first_name: data.FirstName, last_name: data.LastName, email: data.Email, image_url: "", dob: data.DateOfBirth, bio: data.Bio, nickname: data.Nickname }));
                            // router.replace("/");
                            location.replace("/");
                        });
                    } else {
                        alert("credentials not entered correctly");
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
                    setIsLogin(false);
                }}>Register</a>
            </span>
            <button type="submit" className="btn btn-dark mt-3">Login</button>
        </form>
    </Card > : <Card title="Register" color={color}>
        <Metadata seoTitle="Friendz | Register" seoDescription="The next gen social network" />
        <form className="d-flex flex-column"   onSubmit={async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target as HTMLFormElement);

    let imageContent: string | undefined = undefined;

    const fileInput = (e.target as HTMLFormElement).querySelector('input[type="file"]') as HTMLInputElement;
    const file = fileInput.files?.[0];
    if (file) {
      const reader = new FileReader();
      imageContent = await new Promise<string>((resolve, reject) => {
        reader.onload = (event) => resolve(event.target?.result as string);
        reader.onerror = (error) => reject(error);
        reader.readAsDataURL(file);
      });
      // Strip the "data:image/*;base64," prefix.
      imageContent = imageContent.substring(imageContent.indexOf(",") + 1);
    }

    const payload = {
      username: formData.get("username"),
      password: formData.get("password"),
      email: formData.get("email"),
      first_name: formData.get("first_name"),
      last_name: formData.get("last_name"),
      nickname: formData.get("nickname"),
      date_of_birth: formData.get("date_of_birth"),
      image: imageContent, // Base64-encoded image
      bio: formData.get("bio") ?? "",
      type: formData.get("type"), // Public or Private
    };

    try {
      const response = await fetch("http://localhost:8080/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        alert("Registration successful! You can now log in.");
        setIsLogin(true);
      } else {
        const errorText = await response.text();
        alert(`Registration failed: ${errorText}`);
      }
    } catch (err) {
      console.error("Error during registration:", err);
      alert("An error occurred. Please try again.");
    }

        }}>
            {/* <h3 className="text-center">Please enter your account details</h3> */}
            <div className="mb-3">
                <label className="form-label">Email *</label>
                <div id="usernameHelp" style={{ color: "red", fontSize: "0.875rem" }}>Your email must contain @.</div>
                <input type="email" className="form-control" name="email" aria-describedby="emailHelp" required />
            </div>
            <div className="mb-3">
                <label className="form-label">User name *</label>
                <div id="usernameHelp" style={{ color: "red", fontSize: "0.875rem" }}>{/*Your username must be between 6 and 12 characters.*/}</div>
                <input type="text" className="form-control" name="username" aria-describedby="usernameHelp" required />
            </div>

            <div className="mb-3">
                <label className="form-label">First name *</label>
                <input type="text" className="form-control" name="first_name" aria-describedby="firstNameHelp" required />
            </div>

            <div className="mb-3">
                <label className="form-label">Last name *</label>
                <input type="text" className="form-control" name="last_name" aria-describedby="lastNameHelp" required />
            </div>
            <div className="mb-3">
                <label className="form-label">Nickname</label>
                <input type="text" className="form-control" name="nickname" />
            </div>
            <div className="mb-3">
                <label className="form-label">Password *</label>
                <input type="password" className="form-control" name="password" required />
            </div>
            <div className="mb-3">
                <label className="form-label">Privacy Type *</label>
                <select className="form-select" defaultValue="Public" name="type">
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                </select>
            </div>
            <div className="mb-3">
                <label className="form-label">Date of birth *</label>
                <input
                    id="avatar"
                    type="date"
                    className="form-control"
                    name="date_of_birth"
                    aria-describedby="dobHelp"
                    max={new Date().toISOString().split("T")[0]} required />{/** Restrict to dates before today */}
            </div>

            <div className="mb-3">
                <label className="form-label">Avatar</label>
                <input
                    type="file"
                    className="form-control"
                    name="image"
                    aria-describedby="avatarHelp"
                    accept="image/*"  /> {/* Only allows image files */}

                <small id="avatarHelp" className="form-text text-muted">
                    Please upload an image file (e.g., .jpg, .png).
                </small>
            </div>

            <div className="mb-3">
                <label className="form-label">About Me</label>
                <textarea
                    className="form-control"
                    name="bio"
                    aria-describedby="aboutMeHelp"
                    rows={4} // Adjust the number of rows as needed
                ></textarea>
                <small id="aboutMeHelp" className="form-text text-muted">
                    Tell us a little about yourself.
                </small>
            </div>
            <span>
                Have an existing account <a href="#" onClick={() => {
                    setIsLogin(true);
                }}>Login</a>
            </span>
            <br />
            <button type="submit" className="btn btn-dark mt-3">Register</button>
        </form>
    </Card>;
}