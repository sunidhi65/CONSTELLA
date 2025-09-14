
import React from 'react';

const StarfieldBackground: React.FC = () => {
  return (
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
      <div id="stars1" className="stars"></div>
      <div id="stars2" className="stars"></div>
      <div id="stars3" className="stars"></div>
      <style>{`
        @keyframes move-twink-back {
            from {background-position:0 0;}
            to {background-position:-10000px 5000px;}
        }
        
        .stars {
         position:absolute;
         top:0;
         left:0;
         right:0;
         bottom:0;
         width:100%;
         height:100%;
         display:block;
        }
        
        #stars1 {
         background:transparent url(https://www.script-tutorials.com/demos/360/images/stars.png) repeat top center;
         z-index:0;
        }
        
        #stars2 {
         background:transparent url(https://www.script-tutorials.com/demos/360/images/twinkling.png) repeat top center;
         z-index:1;
         animation:move-twink-back 200s linear infinite;
        }
        
        #stars3 {
         background:transparent url(https://www.script-tutorials.com/demos/360/images/clouds.png) repeat top center;
         z-index:2;
         opacity: 0.3;
        }
        
        .shooting-star {
            position: absolute;
            height: 2px;
            background: linear-gradient(-45deg, rgba(167, 125, 250, 1), rgba(167, 125, 250, 0));
            border-radius: 999px;
            filter: drop-shadow(0 0 6px rgba(167, 125, 250, 1));
            animation: tail 3s ease-in-out infinite, shooting 3s ease-in-out infinite;
        }
        
        @keyframes tail {
            0% { width: 0; }
            30% { width: 100px; }
            100% { width: 0; }
        }
        
        @keyframes shooting {
            0% { transform: translateX(0); }
            100% { transform: translateX(300px); }
        }
      `}</style>
    </div>
  );
};

export default React.memo(StarfieldBackground);
