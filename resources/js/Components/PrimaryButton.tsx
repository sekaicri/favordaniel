import { ButtonHTMLAttributes } from 'react';

export default function PrimaryButton({
    className = '',
    disabled,
    children,
    ...props
}: ButtonHTMLAttributes<HTMLButtonElement>) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-xl border border-transparent bg-gradient-to-r from-[#e91e63] to-[#c2185b] px-4 py-3 text-sm font-extrabold tracking-widest text-white transition-all duration-300 hover:-translate-y-0.5 shadow-[0_4px_15px_rgba(233,30,99,0.3)] focus:outline-none focus:ring-2 focus:ring-[#e91e63] focus:ring-offset-2 active:bg-[#880e4f] ${
                    disabled && 'opacity-25 shadow-none hover:translate-y-0 cursor-not-allowed'
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
