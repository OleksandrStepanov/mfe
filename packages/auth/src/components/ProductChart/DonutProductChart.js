import React, {useEffect} from "react";
import ReactApexChart from 'react-apexcharts'
import allMockAPIs from "./../MockAPI"

export function DonutProductChart({ series }) {
    let seriesMock = series ? Object.values(series) : [Number(allMockAPIs().overview.result[0].bets_number), Number(allMockAPIs().overview.result[1].bets_number)]
    const options = {
        chart: {
            width: '100%',
            type: 'donut',
        },
        colors: series.casino && series.sport ? ['#57D6DB', '#FF5676'] : series.casino && !series.sport ? ['#57D6DB'] : !series.casino && series.sport ? ['#FF5676'] : [],
        dataLabels: {
            enabled: false
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: {
                    width: '100%'
                },
                legend: {
                    show: false
                }
            }
        }],
        legend: {
            show: false
        }
    };

    return (
        <div>
            <ReactApexChart options={options} series={seriesMock} type="donut" width={300}/>
        </div>
    )
}