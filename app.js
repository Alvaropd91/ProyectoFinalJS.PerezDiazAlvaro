class Producto {
    constructor(id, nombre, precio, stock, img, descripcion, alt) {
        this.id = id
        this.nombre = nombre
        this.cantidad = 1
        this.precio = precio
        this.stock = stock
        this.img = img
        this.descripcion = descripcion
        this.alt = alt
    }
}

class ProductoController {
    constructor() {
        this.listaProductos = []
        this.contenedor_productos = document.getElementById("contenedor_productos")
    }

    async levantarProductos(controladorCarrito) {
        const resp = await fetch("www.pastasartesanales.json")
        this.listaProductos = await resp.json()

        this.mostrarENDOM()
        this.darEventoClickAProductos(controladorCarrito)
    }

    mostrarENDOM() {
        //mostramos los productos en DOM de manera dinamica
        this.listaProductos.forEach(producto => {
            this.contenedor_productos.innerHTML += `
            <div class="card" style="width: 18rem;">
                <img src="${producto.img}" class="card-img-top" alt="${producto.alt}">
                <div class="card-body">
                    <h5 class="card-title">${producto.nombre}</h5>
                    <p class="card-text">${producto.descripcion}</p>
                    <p class="card-text">Precio:$${producto.precio}</p>
                    <a href="#" id="cpu-${producto.id}" class="btn btn-primary">Añadir producto</a>
                </div>
            </div>`
        })
    }


    darEventoClickAProductos(controladorCarrito) {
        this.listaProductos.forEach(producto => {
            const btnAP = document.getElementById(`cpu-${producto.id}`)
            btnAP.addEventListener("click", () => {

                controladorCarrito.agregar(producto)
                controladorCarrito.guardarEnStorage()
                    //TODO: QUE SOLO AÑADA 1 PRODUCTO AL DOM . QUE NO RECORRA TODA LA LISTA 
                controladorCarrito.mostrarENDOM(contenedor_carrito)

                Toastify({
                    text: `${producto.nombre} añadido con exito!`,
                    duration: 3000,

                    gravity: "bottom", // `top` or `bottom`
                    position: "right", //`left` or `right`

                    style: {
                        background: "linear-gradient(to right, #00b09b, #96c93d)",
                    }
                }).showToast();
            })
        })
    }
}

class CarritoController {
    constructor() {
        this.precio_total = document.getElementById("precio_total")
        this.listaCarrito = []
        this.contenedor_carrito = document.getElementById("contenedor_carrito")
    }

    calcularTotal() {
        let total = 0;

        total = this.listaCarrito.reduce((total, producto) => total + producto.cantidad * producto.precio, 0)

        this.precio_total.innerHTML = `Total a pagar: $${total}`;
    }

    verificarSiExisteElProducto(producto) {
        return this.listaCarrito.find((elemento) => elemento.id == producto.id);
    }

    agregar(producto) {

        if (this.verificarSiExisteElProducto(producto)) {
            producto.cantidad += 1;
        } else {
            this.listaCarrito.push(producto)
        }

    }



    limpiarCarritoEnStorage() {
        localStorage.removeItem("listaCarrito")
    }

    guardarEnStorage() {
        let listaCarritoJSON = JSON.stringify(this.listaCarrito)
        localStorage.setItem("listaCarrito", listaCarritoJSON)
    }
    verificarExistenciaEnStorage() {
        this.listaCarrito = JSON.parse(localStorage.getItem('listaCarrito')) || []
        if (this.listaCarrito.length > 0) {
            this.mostrarENDOM()
        }
    }

    limpiarContenedor_Carrito() {
        this.contenedor_carrito.innerHTML = ""
    }

    borrar(producto) {
        let posicion = this.listaCarrito.findIndex(miProducto => producto.id == miProducto.id)

        if (!(posicion == -1)) {
            this.listaCarrito.splice(posicion, 1)
        }
    }
    mostrarENDOM() {
        this.limpiarContenedor_Carrito()
        this.listaCarrito.forEach(producto => {
            this.contenedor_carrito.innerHTML +=
                `<div class="card mb-3" style="max-width: 540px;">
            <div class="row g-0">
                <div class="col-md-4">
                <img src="${producto.img}" class="img-fluid rounded-start" alt="${producto.alt}">
                </div>
                    <div class="col-md-8">
                        <div class="card-body">
                        <h5 class="card-title">${producto.nombre}</h5>
                        <p class="card-text">Presentación${producto.alt}</p>
                        <p class="card-text">Precio: $${producto.precio}</p>
                        <p class="card-text">Cantidad: ${producto.cantidad}</p>
                        <button class="btn btn-danger" id="borrar-${producto.id}"><i class="fa-solid fa-trash"></i></button>
                    </div>
                </div>
            </div>
        </div>`
        })
        this.listaCarrito.forEach(producto => {
            const btnBorrar = document.getElementById(`borrar-${producto.id}`)

            btnBorrar.addEventListener("click", () => {

                this.borrar(producto);
                this.guardarEnStorage();
                this.mostrarENDOM();
            })
        })
        this.calcularTotal()
    }
}


const controladorProductos = new ProductoController()

const controladorCarrito = new CarritoController()
controladorProductos.levantarProductos(controladorCarrito)



//verifica en Storage y muestra en DOM
controladorCarrito.verificarExistenciaEnStorage()

//DOM
controladorProductos.mostrarENDOM()

//EVENTOS
controladorProductos.darEventoClickAProductos(controladorCarrito)
const finalizar_compra = document.getElementById("finalizar_compra")
finalizar_compra.addEventListener("click", () => {
    Swal.fire({
        position: 'center',
        icon: 'success',
        title: 'Su pedido fue realizado con exito. ¡Muchas gracias!',
        showConfirmButton: false,
        timer: 2000
    })
    controladorCarrito.limpiarContenedor_Carrito()
    controladorCarrito.limpiarCarritoEnStorage()
    controladorCarrito.listaCarrito = []
})