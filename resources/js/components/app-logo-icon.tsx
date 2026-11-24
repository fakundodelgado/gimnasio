import type { ImgHTMLAttributes } from "react";

export default function AppLogoIcon({
    className = "",
    ...props
}: ImgHTMLAttributes<HTMLImageElement>) {
    return (
        <img
            src="/favicon.svg"
            alt="Logo del Gimnasio"
            className={`object-contain ${className}`}
            {...props}
        />
    );
}
