import { Form } from "react-router";

type Props = {
    error?: string;
};

export function LoginForm({ error }: Props) {
    return (
        <div className="max-w-md w-full">
            <div className="bg-white p-8 rounded-2xl shadow-xl border border-gray-200 space-y-8">

                <header className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">
                        X1
                    </h2>
                    <p className="text-gray-600">Sign in to your account</p>
                </header>

                {error && (
                    <div className="rounded-xl bg-red-40 p-1 border border-red-200">
                        <div className="flex items-center justify-center">
                            <svg className="h-4 w-4 text-red-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                                    clipRule="evenodd"
                                />
                            </svg>
                            <p className="text-sm font-medium text-red-800">{error}</p>
                        </div>
                    </div>
                )}

                <Form method="post" className="space-y-6">
                    <LoginFields
                        id="email"
                        name="email"
                        label="User email"
                        type="email"
                        autoComplete="useremail"
                        placeholder="Enter your email"
                    />
                    <LoginFields
                        id="password"
                        name="password"
                        label="User password"
                        type="password"
                        autoComplete="userpassword"
                        placeholder="Enter your password"
                    />

                    <button type="submit" className="w-full cursor-pointer bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 px-4 rounded-xl shadow-lg">
                        Sign In
                    </button>
                </Form>
            </div>
        </div>
    );
}

/* ------------------------------------------------------------------ */
/* Internal helper – not exported                                      */
/* ------------------------------------------------------------------ */

type FieldProps = {
    id: string;
    name: string;
    label: string;
    type?: string;
    placeholder?: string;
    autoComplete?: string;
};


function LoginFields({ id, name, label, type = "text", placeholder, autoComplete, }: FieldProps) {
    return (
        <div>
            <label htmlFor={id} className="block text-sm font-semibold text-gray-700 mb-2"> {label}</label>
            <input
                id={id}
                name={name}
                type={type}
                autoComplete={autoComplete}
                placeholder={placeholder}
                required
                className=" w-full px-3 py-2 border border-gray-300 rounded-xl shadow-sm bg-white text-gray-900 " />
        </div>
    );
}

