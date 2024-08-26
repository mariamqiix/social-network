'use client';

import { useState } from "react";

export default function loginPage() {
    let [isRegister, setIsRegister] = useState(true);

    return isRegister ? <form className="w-100 h-100 p-5 d-flex flex-column justify-content-center">
        <h3 className="text-center">Please enter your login details</h3>
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
        <br/>
        <button type="submit" className="btn btn-dark">Login</button>
    </form> : <form className="w-100 h-100 p-5 d-flex flex-column justify-content-center">
        <h3 className="text-center">Please enter your account details</h3>
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
        <br/>
        <button type="submit" className="btn btn-dark">Register</button>
    </form>;
}