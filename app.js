new Vue({
    el: '#app',
    data: {
        saludJugador: 100,
        saludMonstruo: 100,
        hayUnaPartidaEnJuego: false,
        turnos: [], //es para registrar los eventos de la partida
        esJugador: false,
        rangoAtaque: [3, 10],
        rangoAtaqueEspecial: [10, 20],
        rangoAtaqueDelMonstruo: [5, 12],
    },

    methods: {
        getSalud(salud) {
            return `${salud}%`
        },
        empezarPartida: function () {
            this.hayUnaPartidaEnJuego = true;
            this.saludJugador = 100;
            this.saludMonstruo = 100;
            this.turnos = [];
        },
        atacar: function () {
            var heridaMonstruo = this.calcularHeridas(this.rangoAtaque);
            this.saludMonstruo -= heridaMonstruo;

            this.turnos.unshift({
                esJugador: true,
                text: 'El jugador golpea al monstruo por ' + heridaMonstruo + '%'
            });

            if (this.verificarGanador())
                return;

            this.ataqueDelMonstruo();   
        },

        ataqueEspecial: function () {
            var herida = this.calcularHeridas(this.rangoAtaqueEspecial);
            this.saludMonstruo -= herida;

            this.turnos.unshift({
                esJugador: true,
                text:'El jugador golpea al monstruo por ' + herida
            });

            if(this.verificarGanador()) {
                return;
            }
            this.ataqueDelMonstruo();
        },

        curar: function () {
            var msj_curar = null;
            var cura = 10;
            var vida_min = 90;
            var vida_max = 100;

            if (this.saludJugador <= vida_min) {
                this.saludJugador += cura;
                msj_curar = 'Te curaste en un 10%'
            } else {
                this.saludJugador = vida_max;
                msj_curar = 'El jugador tiene la salud a full'
            }

            this.turnos.unshift({
                esJugador: true,
                text: msj_curar
            }); 
            this.ataqueDelMonstruo();
        },

        registrarEvento(evento) {
        },
        terminarPartida: function () {
            this.hayUnaPartidaEnJuego = false;
        },

        ataqueDelMonstruo: function () {
            var herida = this.calcularHeridas(this.rangoAtaqueDelMonstruo);
            this.saludJugador -= herida;

            this.turnos.unshift({
                esJugador: false,
                text: 'El momnstruo lastima al jugador en ' + herida + '%'
            });
            this.verificarGanador();
        },

        calcularHeridas: function (rango) {
            return Math.max(Math.floor(Math.random() * rango[1]) + 1, rango[0]);
        },
        verificarGanador: function () {
            if (this.saludMonstruo <=0) {
                if (confirm('Ganaste! Jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            } else if (this.saludJugador <= 0) {
                if (confirm('Perdiste! Jugar de nuevo?')) {
                    this.empezarPartida();
                } else {
                    this.hayUnaPartidaEnJuego = false;
                }
                return true;
            }
            return false;
        },
        cssEvento(turno) {
            //Este return de un objeto es porque vue asi lo requiere, pero ponerlo acá queda mucho mas entendible en el codigo HTML.
            return {
                'player-turno': turno.esJugador,
                'monster-turno': !turno.esJugador
            }
        }
    }
});