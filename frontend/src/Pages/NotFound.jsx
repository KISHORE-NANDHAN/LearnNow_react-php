import React, { useEffect } from 'react';

const ErrorPage = () => {
  useEffect(() => {
    const drawVisor = () => {
      const canvas = document.getElementById('visor');
      if (!canvas) return; // Ensure canvas exists before proceeding
      const ctx = canvas.getContext('2d');

      ctx.beginPath();
      ctx.moveTo(5, 45);
      ctx.bezierCurveTo(15, 64, 45, 64, 55, 45);

      ctx.lineTo(55, 20);
      ctx.bezierCurveTo(55, 15, 50, 10, 45, 10);

      ctx.lineTo(15, 10);

      ctx.bezierCurveTo(15, 10, 5, 10, 5, 20);
      ctx.lineTo(5, 45);

      ctx.fillStyle = '#2f3640';
      ctx.strokeStyle = '#f5f6fa';
      ctx.fill();
      ctx.stroke();
    };

    const cordCanvas = document.getElementById('cord');
    if (!cordCanvas) return; // Ensure cordCanvas exists
    const ctx = cordCanvas.getContext('2d');

    let y1 = 160;
    let y2 = 100;
    let y3 = 100;

    let y1Forward = true;
    let y2Forward = false;
    let y3Forward = true;

    const animate = () => {
      requestAnimationFrame(animate);
      ctx.clearRect(0, 0, cordCanvas.width, cordCanvas.height);  // Use cordCanvas.width/height

      ctx.beginPath();
      ctx.moveTo(130, 170);
      ctx.bezierCurveTo(250, y1, 345, y2, 400, y3);

      ctx.strokeStyle = 'white';
      ctx.lineWidth = 8;
      ctx.stroke();

      if (y1 === 100) {
        y1Forward = true;
      }

      if (y1 === 300) {
        y1Forward = false;
      }

      if (y2 === 100) {
        y2Forward = true;
      }

      if (y2 === 310) {
        y2Forward = false;
      }

      if (y3 === 100) {
        y3Forward = true;
      }

      if (y3 === 317) {
        y3Forward = false;
      }

      y1Forward ? y1 += 1 : y1 -= 1;
      y2Forward ? y2 += 1 : y2 -= 1;
      y3Forward ? y3 += 1 : y3 -= 1;
    };

    drawVisor();
    animate();
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden bg-gradient-to-r from-gray-700 via-gray-800 to-gray-900">
      {/* Moon and Craters */}
      <div className="absolute top-[-100px] left-[-300px] w-[900px] h-[900px] rounded-full bg-gradient-to-r from-gray-300 to-gray-500 shadow-2xl">
        <div className="absolute top-[250px] left-[500px] w-[60px] h-[180px] rounded-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60"></div>
        <div className="absolute top-[650px] left-[340px] w-[40px] h-[80px] rounded-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60 transform rotate-12"></div>
        <div className="absolute top-[-20px] left-[40px] w-[65px] h-[120px] rounded-full bg-gradient-to-r from-gray-600 to-gray-400 opacity-60 transform rotate-[250deg]"></div>
      </div>

      {/* Stars */}
      <div className="star absolute top-[40%] left-[50%] w-[5px] h-[5px] rounded-full bg-gray-400 opacity-40 animate-shimmer animation-delay-1000"></div>
      <div className="star absolute top-[60%] left-[90%] w-[5px] h-[5px] rounded-full bg-gray-400 opacity-40 animate-shimmer animation-delay-3000"></div>
      <div className="star absolute top-[10%] left-[70%] w-[5px] h-[5px] rounded-full bg-gray-400 opacity-40 animate-shimmer animation-delay-2000"></div>
      <div className="star absolute top-[90%] left-[40%] w-[5px] h-[5px] rounded-full bg-gray-400 opacity-40 animate-shimmer"></div>
      <div className="star absolute top-[20%] left-[30%] w-[5px] h-[5px] rounded-full bg-gray-400 opacity-40 animate-shimmer animation-delay-500"></div>

      {/* Error Content */}
      <div className="absolute left-[100px] top-[400px] -translate-y-1/2 font-righteous text-gray-600">
        <div className="text-9xl">404</div>
        <div className="text-3xl">Hmmm...</div>
        <div className="opacity-50">It looks like one of the developers fell asleep</div>
        <div className="mt-8">
        <a href='/'><button className="error__button px-5 py-2.5 mr-2 text-sm font-medium text-white bg-orange-500 rounded-lg border border-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 dark:bg-orange-600 dark:hover:bg-orange-700 dark:focus:ring-orange-800">
            Home
          </button></a>
          <a href='/login'><button className="error__button px-5 py-2.5 mr-2 text-sm font-medium text-gray-500 bg-transparent rounded-lg border border-gray-600 hover:bg-gray-100 focus:ring-4 focus:outline-none focus:ring-gray-200 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-800">
          Login
          </button></a>
        </div>
      </div>

      {/* Astronaut */}
      <div className="astronaut absolute left-[70%] top-[50%] -translate-x-1/2 -translate-y-1/2 rotate-[20deg] scale-125">
        <div className="astronaut__head absolute top-[60px] left-[60px] w-[60px] h-[60px] rounded-full bg-white">
          <canvas id="visor" width="60px" height="60px"></canvas>
          <div className="astronaut__head-visor-flare1 absolute top-[28px] left-[40px] w-[10px] h-[10px] rounded-full bg-gray-600 opacity-50"></div>
          <div className="astronaut__head-visor-flare2 absolute top-[40px] left-[38px] w-[5px] h-[5px] rounded-full bg-gray-700 opacity-30"></div>
        </div>
        <div className="astronaut__backpack absolute top-[90px] left-[47px] w-[86px] h-[90px] rounded-md bg-gray-400"></div>
        <div className="astronaut__body absolute top-[115px] left-[55px] w-[70px] h-[80px] rounded-md bg-gray-200"></div>
        <div className="astronaut__body__chest absolute top-[140px] left-[68px] w-[45px] h-[25px] rounded-md bg-gray-300"></div>
        <div className="astronaut__arm-left1 absolute top-[127px] left-[9px] w-[65px] h-[20px] rounded-md bg-gray-200 origin-top-right -rotate-30"></div>
        <div className="astronaut__arm-left2 absolute top-[102px] left-[7px] w-[20px] h-[45px] rounded-md bg-gray-200 origin-bottom-right -rotate-[12deg] rounded-tl-[8em] rounded-tr-[8em]"></div>
        <div className="astronaut__arm-right1 absolute top-[113px] left-[100px] w-[65px] h-[20px] rounded-md bg-gray-200 origin-top-left -rotate-[10deg]"></div>
        <div className="astronaut__arm-right2 absolute top-[78px] left-[141px] w-[20px] h-[45px] rounded-md bg-gray-200 origin-bottom-left -rotate-[10deg] rounded-tl-[8em] rounded-tr-[8em]"></div>
        <div className="astronaut__arm-thumb-left absolute top-[110px] left-[21px] w-[10px] h-[6px] rounded-full bg-gray-200 origin-top -rotate-[35deg]"></div>
        <div className="astronaut__arm-thumb-right absolute top-[90px] left-[133px] w-[10px] h-[6px] rounded-full bg-gray-200 origin-top rotate-5"></div>
        <div className="astronaut__wrist-left absolute top-[122px] left-[6.5px] w-[21px] h-[4px] rounded-full bg-orange-500 origin-top -rotate-[15deg]"></div>
        <div className="astronaut__wrist-right absolute top-[98px] left-[141px] w-[21px] h-[4px] rounded-full bg-orange-500 origin-top -rotate-[10deg]"></div>
        <div className="astronaut__leg-left absolute top-[188px] left-[50px] w-[23px] h-[75px] bg-gray-200 origin-top rotate-2"></div>
        <div className="astronaut__leg-right absolute top-[188px] left-[108px] w-[23px] h-[75px] bg-gray-200 origin-top -rotate-2"></div>
        <div className="astronaut__foot-left absolute top-[240px] left-[43px] w-[28px] h-[20px] bg-white origin-top rotate-2 rounded-md rounded-tl-[8em] rounded-tr-[8em] border-b-4 border-orange-500"></div>
        <div className="astronaut__foot-right absolute top-[240px] left-[111px] w-[28px] h-[20px] bg-white origin-top -rotate-2 rounded-md rounded-tl-[8em] rounded-tr-[8em] border-b-4 border-orange-500"></div>

        {/* Cord Canvas */}
        <div className="astronaut__cord absolute">
          <canvas id="cord" height="500px" width="500px"></canvas>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;