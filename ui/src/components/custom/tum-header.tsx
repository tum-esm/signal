import Link from "next/link";
import { TUMLogo } from "./icons";

export function TUMHeader() {
    return (
        <header className="flex flex-row items-center justify-start flex-shrink-0 w-full h-16 px-6 border-b border-slate-200">
            <Link
                href="/"
                className="-ml-6 flex h-full w-[5.5rem] items-center border-r border-slate-300 bg-slate-900 px-6 text-slate-100"
            >
                <TUMLogo />
            </Link>
            <Link href="/">
                <h1 className="hidden pl-5 font-light uppercase text-slate-950 xl:block xl:text-lg 2xl:text-xl">
                    <span className="font-medium">Signal</span> &nbsp;|&nbsp;
                    Professorship of Environmental Sensing and Modeling
                </h1>
            </Link>
            <div className="flex-grow" />
            <p className="text-slate-800">
                powered by{" "}
                <Link
                    href="https://github.com/tum-esm/signal"
                    target="_blank"
                    className="font-medium underline text-slate-950 hover:text-rose-600"
                >
                    github.com/tum-esm/signal
                </Link>
            </p>
        </header>
    );
}
