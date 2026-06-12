google.charts.load('current', {
    packages: ['corechart']
});

google.charts.setOnLoadCallback(cargarDatos);

document
    .getElementById('actualizar')
    .addEventListener('click', cargarDatos);

async function cargarDatos() {

    const respuesta = await fetch('ventas.json');

    const datos = await respuesta.json();

    datos.forEach(item => {

        item.ventas += Math.floor(Math.random() * 20);

        item.ingresos = item.ventas * item.precio;

    });

    dibujarGraficoGoogle(datos);

    dibujarGraficoD3(datos);
}

function dibujarGraficoGoogle(datos) {

    const tabla = new google.visualization.DataTable();

    tabla.addColumn('string', 'Producto');
    tabla.addColumn('number', 'Ventas');

    datos.forEach(item => {

        tabla.addRow([
            item.producto + ' ' + item.mes,
            item.ventas
        ]);

    });

    const opciones = {
        title: 'Ventas por Producto',
        height: 500
    };

    const chart = new google.visualization.ColumnChart(
        document.getElementById('graficoGoogle')
    );

    chart.draw(tabla, opciones);

}
function dibujarGraficoD3(datos) {

    d3.select("#graficoD3").selectAll("*").remove();

    const svg = d3.select("#graficoD3");

    svg.selectAll("circle")
        .data(datos)
        .enter()
        .append("circle")

        .attr("cx", (d, i) => 150 + i * 180)

        .attr("cy", d => 350 - d.ventas)

        .attr("r", d => d.ingresos / 1500)

        .attr("fill", (d, i) => {

            const colores = [
                "#4285F4",
                "#EA4335",
                "#34A853"
            ];

            return colores[i % 3];

        })

        .style("opacity", 0.8)

        .on("mouseover", function(event, d) {

            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", d.ingresos / 1000);

        })

        .on("mouseout", function(event, d) {

            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", d.ingresos / 1500);

        })

        .append("title")

        .text(d =>
            `${d.producto}
Ventas: ${d.ventas}
Ingresos: ${d.ingresos}
Precio: ${d.precio}`
        );

}