import React, { useEffect, useRef, useState } from 'react';
import './Accueil.css'; // Si vous avez un fichier CSS pour les styles

const Accueil: React.FC = () => {
  const pictitleRef = useRef<HTMLDivElement | null>(null);
  const [index, setIndex] = useState(0);
  const scrollWidth = 150; // Largeur d'une image + espacement
  const images = [
    '/assets/images/v1.png',
    '/assets/images/p1.png',
    '/assets/images/v2.png',
    '/assets/images/p2.png',
    '/assets/images/v3.png',
    '/assets/images/p3.png',
    '/assets/images/p4.png',
    // Ajoutez d'autres images ici
  ];
  const totalImages = images.length;

  useEffect(() => {
    // Clonage des premières images pour créer l'effet infini
    const pictitle = pictitleRef.current;
    if (pictitle) {
      for (let i = 0; i < totalImages; i++) {
        const img = document.createElement('img');
        img.src = images[i];
        pictitle.appendChild(img);
      }
    }

    const interval = setInterval(() => {
      autoScroll();
    }, 2000);

    return () => clearInterval(interval);
  }, [index, images]);

  const autoScroll = () => {
    const pictitle = pictitleRef.current;
    if (pictitle) {
      setIndex((prevIndex) => prevIndex + 1);
      pictitle.style.transition = 'transform 0.5s ease';
      pictitle.style.transform = `translateX(${-index * scrollWidth}px)`;

      if (index >= totalImages) {
        setTimeout(() => {
          pictitle.style.transition = 'none'; // Supprime la transition pour ne pas montrer le saut
          pictitle.style.transform = `translateX(0px)`; // Retour à la première image
          setIndex(0);
        }, 500);
      }
    }
  };

  return (
    <div className='custom-body'>
        <div className="page">

            <div className="logtitle">
                <img src="assets/logo.png" alt=""/>

                    <div className="statuttitle">
                        <p>CONFORT</p>

                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="#181818" className="bi bi-patch-plus-fill" viewBox="0 0 16 16">
                            <path d="M10.067.87a2.89 2.89 0 0 0-4.134 0l-.622.638-.89-.011a2.89 2.89 0 0 0-2.924 2.924l.01.89-.636.622a2.89 2.89 0 0 0 0 4.134l.637.622-.011.89a2.89 2.89 0 0 0 2.924 2.924l.89-.01.622.636a2.89 2.89 0 0 0 4.134 0l.622-.637.89.011a2.89 2.89 0 0 0 2.924-2.924l-.01-.89.636-.622a2.89 2.89 0 0 0 0-4.134l-.637-.622.011-.89a2.89 2.89 0 0 0-2.924-2.924l-.89.01zM8.5 6v1.5H10a.5.5 0 0 1 0 1H8.5V10a.5.5 0 0 1-1 0V8.5H6a.5.5 0 0 1 0-1h1.5V6a.5.5 0 0 1 1 0" />
                        </svg>
                    </div>
                </div>

                <div className="pictitle-wrapper">
                    <div className="pictitle" ref={pictitleRef}>
                        {images.map((src, idx) => (
                            <img key={idx} src={src} alt={`Image ${idx}`} />
                        ))}
                    </div>
                </div>


                <div className="contenttitle">
            <div className="t">
                <div className="bienvenue">
                    <h1>Bienvenue <br/><span>Moov</span> </h1>
                </div>
                <div className="text">
                    <p>Moov est une application de service de transport conçue pour vous aider dans vos déplacements sans attente ni perturbation de votre espace personnel.</p>
                </div>
            </div>
            
            <div className="texture">
                <svg width="363" height="46" viewBox="0 0 363 46" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.5 0.502701C16.9176 0.680589 25.4098 9.61034 32.3395 16.9114L32.3396 16.9115C35.6843 20.4328 38.3761 23.1672 41.3201 25.0104C44.289 26.8692 47.496 27.8125 51.8592 27.8125C56.2224 27.8125 59.4294 26.8692 62.3983 25.0104C65.3423 23.1672 68.0341 20.4328 71.3788 16.9115L71.3791 16.9112C78.3714 9.53659 86.9654 0.5 103.711 0.5C120.457 0.5 129.051 9.53658 136.051 16.9114L136.051 16.9115C139.395 20.4328 142.087 23.1672 145.03 25.0104C147.998 26.8692 151.204 27.8125 155.563 27.8125C159.923 27.8125 163.13 26.8692 166.1 25.0105C169.044 23.1673 171.738 20.4329 175.083 16.9115L175.083 16.9114C182.083 9.53658 190.677 0.5 207.422 0.5C224.168 0.5 232.762 9.53658 239.762 16.9114L239.762 16.9115C243.107 20.4328 245.799 23.1672 248.743 25.0104C251.711 26.8692 254.918 27.8125 259.282 27.8125C263.645 27.8125 266.852 26.8692 269.821 25.0104C272.765 23.1672 275.457 20.4328 278.801 16.9115L278.439 16.5672L278.801 16.9114C285.801 9.53658 294.395 0.5 311.141 0.5C327.887 0.5 336.481 9.53658 343.48 16.9114L343.843 16.5672L343.48 16.9115C346.825 20.4328 349.517 23.1672 352.461 25.0104C355.315 26.7975 358.39 27.7383 362.5 27.8083V45.4973C346.076 45.3195 337.59 36.3897 330.661 29.0886L330.298 29.4328L330.66 29.0885C327.316 25.5672 324.624 22.8328 321.68 20.9896C318.711 19.1308 315.504 18.1875 311.141 18.1875C306.778 18.1875 303.571 19.1308 300.602 20.9896C297.658 22.8328 294.966 25.5672 291.621 29.0885L291.984 29.4328L291.621 29.0886C284.621 36.4634 276.027 45.5 259.282 45.5C242.536 45.5 233.942 36.4634 226.942 29.0886L226.942 29.0885C223.597 25.5672 220.906 22.8328 217.962 20.9896C214.993 19.1308 211.786 18.1875 207.422 18.1875C203.059 18.1875 199.852 19.1308 196.883 20.9896C193.939 22.8328 191.247 25.5672 187.903 29.0885L187.903 29.0886C180.903 36.4634 172.309 45.5 155.563 45.5C138.817 45.5 130.223 36.4634 123.224 29.0886L123.224 29.0885C119.879 25.5672 117.187 22.8328 114.244 20.9896C111.276 19.1308 108.071 18.1875 103.711 18.1875C99.3515 18.1875 96.1445 19.1308 93.1749 20.9895C90.23 22.8327 87.5364 25.5671 84.1916 29.0885L84.1915 29.0886C77.1918 36.4634 68.5978 45.5 51.852 45.5C35.1062 45.5 26.5122 36.4635 19.5126 29.0887C16.1713 25.5673 13.4795 22.8328 10.5355 20.9896C7.68133 19.2026 4.60703 18.2617 0.5 18.1917V0.502701Z" stroke="#EE3324"/>
                </svg>
            </div>

            <div className="lien">
                <div className="raison">
                    <h4>Choisissez sur quel compte vous voulez vous connecter.</h4>
                </div>
                <div className="voir">
                    <a href="" className="client">
                        <svg style={{marginLeft: '15px'}} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-check" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m1.679-4.493-1.335 2.226a.75.75 0 0 1-1.174.144l-.774-.773a.5.5 0 0 1 .708-.708l.547.548 1.17-1.951a.5.5 0 1 1 .858.514M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                        </svg>
                        CLIENT
                        <span>                        
                            <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                                <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                            </svg>
                        </span>

                    </a>
                    <a href="" className="conducteur">
                        <svg style={{marginLeft: '15px'}}  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-person-fill-up" viewBox="0 0 16 16">
                            <path d="M12.5 16a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7m.354-5.854 1.5 1.5a.5.5 0 0 1-.708.708L13 11.707V14.5a.5.5 0 0 1-1 0v-2.793l-.646.647a.5.5 0 0 1-.708-.708l1.5-1.5a.5.5 0 0 1 .708 0M11 5a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                            <path d="M2 13c0 1 1 1 1 1h5.256A4.5 4.5 0 0 1 8 12.5a4.5 4.5 0 0 1 1.544-3.393Q8.844 9.002 8 9c-5 0-6 3-6 4"/>
                          </svg>
                        CONDUCTEUR
                        <span>
                        <svg  xmlns="http://www.w3.org/2000/svg" width="50" height="50" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
                            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
                        </svg>
                        </span>
                    </a>
                </div>
            </div>
        </div>

          </div>
    </div>
  );
};

export default Accueil;
