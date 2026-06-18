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
    height: 500,
    legend: { position: 'top' },
    animation: {
        startup: true,
        duration: 1000,
        easing: 'out'
    }
};

    const chart = new google.visualization.ColumnChart(
        document.getElementById('graficoGoogle')
    );

    chart.draw(tabla, opciones);

}

function dibujarGraficoD3(datos) {

    d3.select("#graficoD3").selectAll("*").remove();

    const svg = d3.select("#graficoD3");

    const width = 900;
    const height = 500;

    const margin = {
        top: 40,
        right: 40,
        bottom: 60,
        left: 80
    };

    const x = d3.scaleLinear()
        .domain([0, d3.max(datos, d => d.ventas) + 20])
        .range([margin.left, width - margin.right]);

    const y = d3.scaleLinear()
        .domain([0, d3.max(datos, d => d.ingresos) + 5000])
        .range([height - margin.bottom, margin.top]);

    const colores = d3.scaleOrdinal()
        .domain(["Smartphone A", "Smartphone B", "Tablet X"])
        .range(["#4285F4", "#EA4335", "#34A853"]);

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .style("font-size", "18px")
        .style("font-weight", "bold")
        .text("Análisis Multidimensional de Ventas");

    svg.append("g")
        .attr("transform",
            `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(x));

    svg.append("g")
        .attr("transform",
            `translate(${margin.left},0)`)
        .call(d3.axisLeft(y));

    svg.append("text")
        .attr("x", width / 2)
        .attr("y", height - 15)
        .attr("text-anchor", "middle")
        .text("Ventas");

    svg.append("text")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 25)
        .attr("text-anchor", "middle")
        .text("Ingresos");

    svg.selectAll("circle")
        .data(datos)
        .enter()
        .append("circle")

        .attr("cx", d => x(d.ventas))
        .attr("cy", d => y(d.ingresos))
        .attr("r", 0)

        .attr("fill", d => colores(d.producto))

        .style("opacity", 0.8)

        .transition()
        .duration(1000)

        .attr("r", d => d.precio / 8);

    svg.selectAll("circle")

        .on("mouseover", function(event, d) {

            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", d.precio / 5);

        })

        .on("mouseout", function(event, d) {

            d3.select(this)
                .transition()
                .duration(300)
                .attr("r", d.precio / 8);

        })

        .append("title")

        .text(d =>
            `${d.producto}
Mes: ${d.mes}
Ventas: ${d.ventas}
Ingresos: ${d.ingresos}
Precio: ${d.precio}`
        );

const leyenda = [
    { nombre: "Smartphone A", color: "#4285F4" },
    { nombre: "Smartphone B", color: "#EA4335" },
    { nombre: "Tablet X", color: "#34A853" }
];

    leyenda.forEach((item, i) => {

        svg.append("circle")
            .attr("cx", 700)
            .attr("cy", 50 + i * 25)
            .attr("r", 8)
            .attr("fill", item.color);

        svg.append("text")
            .attr("x", 720)
            .attr("y", 55 + i * 25)
            .text(item.nombre)
            .style("font-size", "12px");

    });

}