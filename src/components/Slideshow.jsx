import React,{useRef, useEffect, useCallback} from 'react'
import {ReactComponent as FlechaIzquierda} from './../img/iconmonstr-angel-left-thin.svg'
import {ReactComponent as FlechaDerecha} from './../img/iconmonstr-angel-right-thin.svg'
import styled from 'styled-components'




const Slideshow = ({
    children,
    controles = false, 
    autoplay = false, 
    velocidad="500", 
    intervalo="5000"
}) => {

    const slideshow = useRef(null);
    const intervaloSlidershow = useRef(null);
    
    const siguiente = useCallback(() => {

        // Comprobacion que el slideshwo tega elementos
        if(slideshow.current.children.length > 0){
            // obtemos el primer elemento del slideshow.
            const primerElemento = slideshow.current.children[0];
    
            // Establesemos la transición para el slideshow.
            slideshow.current.style.transition = `${velocidad}ms ease-out all`;
    
            // Obtener el acho de slider
            const tamañoSlide = slideshow.current.children[0].offsetWidth;
    
            // Mover el slideshow. 
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`;
    
            //Espera a que finalice la trancicion
            const transicion = () => {
                // Reiniciamos la posicion del Slideshow.
                slideshow.current.style.transition = 'none';
                slideshow.current.style.transform = `translateX(0)`;
    
                // Tomamos el primer elemento y lo mandamos al final.
                slideshow.current.appendChild(primerElemento);
    
                slideshow.current.removeEventListener('transitionend', transicion);
            }
                // Eventlistener para cuando termine la animacion de
                slideshow.current.addEventListener('transitionend', transicion);  
        }          
    }, [velocidad]);
     
    const anterior = () => {
        console.log('anterior');
        if(slideshow.current.children.length > 0){
            // Obtener el ultimo elemento del slidershow 
            const index = slideshow.current.children.length -1;
            const ultimoElemento = slideshow.current.children[index];

            // Colocar el Ultimo elemento al inicio
            slideshow.current.insertBefore(ultimoElemento, slideshow.current.firstChild);
            //Movelo sin transicion 
            slideshow.current.style.transicion = 'none';
              // Obtener el ancho de slider
              const tamañoSlide = slideshow.current.children[0].offsetWidth;
            slideshow.current.style.transform = `translateX(-${tamañoSlide}px)`

            setTimeout(() => {
                slideshow.current.style.transicion = `${velocidad}ms ease-out all`;
                slideshow.current.style.transform = `translateX(0)`;
            },30)

        }
    }

    useEffect(() => {
        if(autoplay){

            intervaloSlidershow.current = setInterval(() => {
                siguiente()
            },intervalo);
    
            // Eliminamos los intervalos 
            slideshow.current.addEventListener('mouseenter', () => {
                clearInterval(intervaloSlidershow.current)
            });
    
            // Volvemos a poner el intervalo cuando saque el cursor 
            slideshow.current.addEventListener('mouseleave', () => {
                intervaloSlidershow.current = setInterval(() => {
                    siguiente()
                },intervalo);
            });
        }
    },[intervalo,autoplay,siguiente])



    return (
        <ContenedorPrincipal>
            <ContenedorSlideshow  ref={slideshow}>
             {children}
        </ContenedorSlideshow>    
            {controles && <Controles>
                <Boton onClick={anterior}>
                    <FlechaIzquierda />
                </Boton>
                <Boton derecho onClick={siguiente}>
                    <FlechaDerecha />
                </Boton>
            </Controles>}
        </ContenedorPrincipal>
    )
}

const ContenedorPrincipal = styled.div`
	position: relative;
`;

const ContenedorSlideshow = styled.div`
	display: flex;
	flex-wrap: nowrap;
`;

const Slide = styled.div`
	min-width: 100%;
	overflow: hidden;
	transition: .3s ease all;
	z-index: 10;
	/* max-height: 500px; */
	position: relative;
	img {
		width: 100%;
		vertical-align: top;
	}
`;

const TextoSlide = styled.div`
	background: ${props => props.colorFondo ? props.colorFondo : 'rgba(0,0,0,.3)'};
	color: ${props => props.colorTexto ? props.colorTexto : '#fff'};
	width: 100%;
	padding: 10px 60px;
	text-align: center;
	position: absolute;
	bottom: 0;
	@media screen and (max-width: 700px) {
		position: relative;
		background: ${props => props.colorFondo ? props.colorFondo : 'rgba(0,0,0,.3)'};
	    color: ${props => props.colorTexto ? props.colorTexto : '#fff'};
	}
`;

const Controles = styled.div`
    position: absolute;
    top: 0;
    z-index: 20;
    width: 100%;
    height: 100%;
    pointer-events: none;
`;

const Boton = styled.button`
	pointer-events: all;
	background: none;
	border: none;
	cursor: pointer;
	outline: none;
	width: 50px;
	height: 100%;
	text-align: center;
	position: absolute;
	transition: .3s ease all;
	/* &:hover {
		background: rgba(0,0,0,.2);
		path {
			fill: #fff;
		}
	} */
	path {
		filter: ${props => props.derecho ? 'drop-shadow(-2px 0px 0px #fff)' : 'drop-shadow(2px 0px 0px #fff)'};
	}
	${props => props.derecho ? 'right: 0' : 'left: 0'}
`;

export {Slideshow, Slide, TextoSlide};
