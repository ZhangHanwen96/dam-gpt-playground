import React from 'react'
import Playground from '@/components/Playground'
import bg from '../../assets/museai-bg.png'
// import Logo from '../../assets/museai-bg.svg'
import './home.css'

const Home = () => {
  return (
    <main
      className=".homepage-bg h-screen w-screen overflow-hidden"
      style={{
        backgroundImage: `url(${bg})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="nav fixed inset-x-0 top-0 z-50 flex h-[96px] items-center md:px-32 xl:px-52">
        <div className="flex flex-row items-center gap-2">
          <span
            className="flex items-center align-middle"
            style={{
              fontSize: '28px'
            }}
          >
            <svg
              className="dg-animated-logo"
              width="1em"
              height="1em"
              viewBox="0 0 160 160"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M128 32H32V128H128V32ZM0 0V160H160V0H0Z"
                fill="url(#paint0_linear_324_2326)"
              ></path>
              <defs>
                <linearGradient
                  id="paint0_linear_324_2326"
                  x1="-1.55448e-06"
                  y1="-1.15411"
                  x2="158"
                  y2="162"
                  gradientUnits="userSpaceOnUse"
                >
                  <stop offset="0" stopColor="#E02E2E">
                    <animate
                      attributeName="stop-color"
                      values="#E02E2E; #C629D4; #3C4FFF; #13DB4B; #FFDB1E; #E02E2E"
                      dur="4s"
                      repeatCount="indefinite"
                    ></animate>
                  </stop>
                  <stop offset="0.25" stopColor="#FFDB1E">
                    <animate
                      attributeName="stop-color"
                      values="#FFDB1E; #E02E2E; #C629D4; #3C4FFF; #13DB4B; #FFDB1E"
                      dur="4s"
                      repeatCount="indefinite"
                    ></animate>
                  </stop>
                  <stop offset="0.5" stopColor="#13DB4B">
                    <animate
                      attributeName="stop-color"
                      values="#13DB4B; #FFDB1E; #E02E2E; #C629D4; #3C4FFF; #13DB4B"
                      dur="4s"
                      repeatCount="indefinite"
                    ></animate>
                  </stop>
                  <stop offset="0.75" stopColor="#3C4FFF">
                    <animate
                      attributeName="stop-color"
                      values="#3C4FFF; #13DB4B; #FFDB1E; #E02E2E; #C629D4; #3C4FFF"
                      dur="4s"
                      repeatCount="indefinite"
                    ></animate>
                  </stop>
                  <stop offset="1" stopColor="#C629D4">
                    <animate
                      attributeName="stop-color"
                      values="#C629D4; #3C4FFF; #13DB4B; #FFDB1E; #E02E2E; #C629D4"
                      dur="4s"
                      repeatCount="indefinite"
                    ></animate>
                  </stop>
                </linearGradient>
              </defs>
            </svg>
          </span>
          <div
            className="text-2xl font-extrabold text-white"
            style={{
              fontFamily: 'Avenir'
            }}
          >
            DAM.GPT Playground
          </div>
        </div>
      </div>
      {/* <div className="mt-24 w-full overflow-y-auto"> */}
      <div
        style={{
          height: '100%'
        }}
        className="home-intro relative flex w-full justify-center overflow-y-auto scroll-smooth py-4 backdrop-blur-sm"
      >
        <div
          className="playground-list absolute inset-x-0 md:px-32 md:py-4 xl:px-52 xl:py-6"
          style={{
            top: 'calc(96px + 80px)'
          }}
        >
          <Playground />
        </div>
      </div>
    </main>
  )
}

export default Home
