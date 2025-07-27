export const Logo = (props: React.SVGProps<SVGSVGElement>) => (
    <div className="flex items-center gap-2" >
        <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
            <g clipPath="url(#clip0_101_2)">
            <path d="M12.919 25.12C14.759 27.84 17.479 29.3333 20.479 29.3333C24.319 29.3333 26.639 26.88 26.639 23.68C26.639 21.44 25.519 19.8933 22.879 17.6L20.039 15.0933C17.919 13.2 16.719 12.0533 16.719 9.81333C16.719 7.84 18.159 6.66667 20.159 6.66667C21.999 6.66667 23.599 7.94667 24.559 10.0267L28.159 7.41333C26.479 4.48 23.759 2.66667 20.239 2.66667C16.319 2.66667 13.119 5.28 13.119 9.17333C13.119 11.84 14.559 13.6533 17.119 15.8933L19.599 18.0267C21.839 19.92 23.039 21.0667 23.039 23.1467C23.039 25.44 21.359 26.6667 19.599 26.6667C17.519 26.6667 15.599 25.28 14.559 23.1467L12.919 25.12Z" fill="hsl(var(--primary))"/>
            </g>
            <defs>
            <clipPath id="clip0_101_2">
                <rect width="32" height="32" fill="white"/>
            </clipPath>
            </defs>
        </svg>
         <span className="font-bold text-lg group-data-[collapsible=icon]:hidden">Crowd AI</span>
    </div>
  );
  