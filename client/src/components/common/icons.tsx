import { LucideProps, User } from "lucide-react";

export const Icons = {
  user: User,
  logo: (props: LucideProps) => {
    return (
      <svg
        fill="#000000"
        height="800px"
        width="800px"
        version="1.1"
        id="Capa_1"
        xmlns="http://www.w3.org/2000/svg"
        xmlnsXlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 483.607 483.607"
        xmlSpace="preserve"
        {...props}
      >
        <g>
          <path
            d="M323.275,315.604l-21.172,21.172l21.213,21.213l153.656-153.657l-21.213-21.213l-21.172,21.172L272.68,42.386
		l21.173-21.172L272.64,0L118.983,153.657l21.213,21.213l21.173-21.173l70.347,70.347L0.759,455l21.213,21.213l230.956-230.956
		L323.275,315.604z M251.467,63.599l161.907,161.906l-68.886,68.886L182.581,132.484L251.467,63.599z"
          />
          <path d="M206.128,383.607v100h276.72v-100H206.128z M452.848,453.607h-216.72v-40h216.72V453.607z" />
        </g>
      </svg>
    );
  },
};
