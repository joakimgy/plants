import { Form, Link } from "@remix-run/react";
import React from "react";

type HeaderProps = {
  title: string;
  centeredText: string;
} & React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLHeadingElement>,
  HTMLHeadingElement
>;

export const Header = ({
  title,
  centeredText,
  className,
  ...rest
}: HeaderProps) => {
  return (
    <header
      className={`flex items-center justify-between bg-slate-800 p-4 text-white ${className}`}
      {...rest}
    >
      <h1 className="text-3xl font-bold">
        <Link to=".">{title}</Link>
      </h1>
      <p>{centeredText}</p>
      <Form action="/logout" method="post">
        <button
          type="submit"
          className="rounded bg-green-700 py-2 px-4 text-white hover:bg-green-600 active:bg-green-700"
        >
          Logout
        </button>
      </Form>
    </header>
  );
};
