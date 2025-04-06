import React, { useState, useEffect, useRef } from 'react';
import styled from "styled-components";
import moment from "moment";

export default function ToolbarLayout({ onDataChange, auth }) {
    let newArray;
    const [activeFilterIndex, setActiveFilterIndex] = React.useState(null);
    const selectRef = useRef(null);
    const datePickerRef = useRef(null);
    const [selectedDates, setSelectedDates] = useState(null);
    const [selectedDomains, setSelectedDomains] = useState(null);
    const [optionDomains, setOptionsDomains] = useState(null);

    const handleFilterClick = (index) => {
        setActiveFilterIndex(activeFilterIndex === index ? null : index);
    };

    const handleClick = () => {
        // This function will be executed when the button is clicked
        console.log('Button clicked!', selectedDates, 'selectedDates', selectedDomains, 'selectedDomains');
        onDataChange({"dates":selectedDates, "domains":selectedDomains});

        // You can add your desired logic here, like:
        // - Making an API call
        // - Updating state
        // - Navigating to another page
        // - etc.
    };

    const handleKeyDown = (event, index) => {
        if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            handleFilterClick(index);
        }
    };

    const handleDomainEvent = (event) => {
        console.log(event, 'event');
    };

    useEffect(() => {
        console.log(auth, 'auth')
        if (!auth || !auth.Signature || !auth.UserIp || !auth.Endpoint) {
            console.warn("Auth headers missing, waiting for authentication...");
            return; // Exit effect early if auth is not ready
        }
        const fetchData = async () => {
            try {
                // setIsLoading(true); // Set loading to true before API call
                const requestOptions = {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Signature': auth.Signature,
                        'Ubo-User-Ip': auth.UserIp,
                        'User-Agent': auth.UserAgent
                    },
                    body: JSON.stringify({
                        "p_report_params":{
                            "p_domains":[
                                "1000"
                            ],
                            "p_environment":"localhost",
                            "p_level":"operator",
                            "p_param_name":[
                                "domains"
                            ],
                            "p_permissions":[
                                "ZG0uZGF0YW1hdHJpeF9keW5hbWljX2RvbWFpbnNfbG9va3VwX2ludm9pY2U=",
                                "ZG0uZGF0YW1hdHJpeF9keW5hbWljX2RvbWFpbnNfbG9va3VwX3JlcG9ydA=="
                            ],
                            "p_permissions_context":"report",
                            "p_user":"oleksandr.stepanov@everymatrix.com"
                        }
                    })
                };
                const result = await fetch(`${auth.Endpoint}?resourceName=domains_lookup&namespace=ce`, requestOptions);
                const resultJson = await result.json();
                const newArray = resultJson.domains.map(item => ({
                    label: item.lookup_value,
                    value: item.lookup_key
                }));
                console.log(newArray, 'newArray');
                setOptionsDomains(newArray);
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                // setIsLoading(false); // Set loading to false after API call completes
            }
        }

        fetchData();
    }, [auth]);

    useEffect(() => {
        const handleDateChange = (event) => {
            console.log('Angular date picker value changed:', event.detail);
            setSelectedDates(event.detail); // Update state with selected dates
            // onDataChange(event.detail);
        };

        const datePickerElement = datePickerRef.current;

        if (datePickerElement) {
            datePickerElement.addEventListener('dm-range-date-picker-changed', handleDateChange);

            return () => {
                datePickerElement.removeEventListener('dm-range-date-picker-changed', handleDateChange);
            };
        }
    }, []); // Empty dependency

    useEffect(() => {
        const handleValueChange = (event) => {
            console.log('Angular component value changed:', event.detail);
            setSelectedDomains(event.detail);
            // Access the value using event.detail
            // ... your logic to handle the value change ...
        };

        const selectElement = selectRef.current; // Get the web component element

        if (selectElement) {
            selectElement.addEventListener('dm-select-value-changed', handleValueChange);

            // Clean up event listener on unmount
            return () => {
                selectElement.removeEventListener('dm-select-value-changed', handleValueChange);
            };
        }

    }, []); // Empty dependency

    return (
        <ToolbarContainer
            role="toolbar"
            aria-label="Data filtering and actions toolbar"
        >
            <everymatrix-dm-select ref={selectRef} is-multi-select={true} label={"Select Option"}  optionValue={"'id'"} optionLabel={"'name'"} placeholder={"test"} disabled={false} filterPlaceholder={"test_filter"} isRequired={true} inputId={"domains"} formControl={"domains"} options={JSON.stringify(optionDomains)} dm-select-value-changed={handleDomainEvent}></everymatrix-dm-select>
            <everymatrix-dm-range-date-picker ref={datePickerRef} ></everymatrix-dm-range-date-picker>

            {/*<button onClick={handleClick}>Click me</button>*/}
            <div style={styles.buttonGroup}>
                <button style={styles.downloadButton} onClick={handleClick}>
                        Run Dashboard
                </button>
            </div>

        </ToolbarContainer>
    );
}

// const [selectedDate, setSelectedDate] = useState('Today');
// const [selectedDomain, setSelectedDomain] = useState('All Domains');
// const dates = ['Today', 'Yesterday', 'Last 7 Days'];
// const domains = ['All Domains', '.com', '.org'];
//
// const handleDateChange = (event) => {
//     setSelectedDate(event.target.value);
// };
//
// const handleDomainChange = (event) => {
//     setSelectedDomain(event.target.value);
// };
//
// return (
//     <div style={styles.container}>
//         <div style={styles.inputGroup}>
//             <select style={styles.select} value={selectedDate} onChange={handleDateChange}>
//                 {dates.map((date) => (
//                     <option key={date} value={date}>{date}</option>
//                 ))}
//             </select>
//             <select style={styles.select} value={selectedDomain} onChange={handleDomainChange}>
//                 {domains.map((domain) => (
//                     <option key={domain} value={domain}>{domain}</option>
//                 ))}
//             </select>
//             <div style={styles.input}>
//                 <span style={styles.icon}>☰</span>
//                 More filters
//             </div>
//         </div>
//         <div style={styles.buttonGroup}>
//             <button style={styles.downloadButton}>
//                 <span style={styles.icon}>⬇</span>
//                 Download as
//             </button>
//         </div>
//     </div>
// );

const styles = {
    container: {
        display: 'flex',
        flex: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '10px',
    },
    inputGroup: {
        display: 'flex',
        alignItems: 'center',
    },
    input: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '6px 12px',
        marginRight: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
    },
    select: {
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '6px 12px',
        marginRight: '8px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        appearance: 'none', // removes default styles
        background: 'transparent',
        paddingRight: '25px',
        backgroundImage: 'url("data:image/svg+xml;utf8,<svg fill=\'black\' height=\'24\' viewBox=\'0 0 24 24\' width=\'24\' xmlns=\'http://www.w3.org/2000/svg\'><path d=\'M7 10l5 5 5-5z\'/><path d=\'M0 0h24v24H0z\' fill=\'none\'/></svg>")',
        backgroundRepeat: 'no-repeat',
        backgroundPosition: 'right 10px center',
    },
    icon: {
        marginRight: '4px',
        fontSize: '16px',
    },
    buttonGroup:{
        display: 'flex',
        alignItems: 'center',
    },
    downloadButton: {
        border: '1px solid #0076DD',
        color: '#0076DD',
        borderRadius: '4px',
        marginTop: '15px',
        padding: '10px 14px',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        whiteSpace: 'nowrap',
        backgroundColor: '#ffffff'
    },
};


const ToolbarContainer = styled.div`
  border-radius: 5px;
  background-color: #fff;
  box-shadow: 0 0 16px rgba(0, 0, 0, 0.06);
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 16px;
  position: relative;
  z-index: 1;
  width: 100%;
  flex: 100%;
`;

const FilterSection = styled.div`
  align-self: stretch;
  display: flex;
  min-width: 240px;
  align-items: start;
  gap: 12px;
  color: var(--Gray-700, #344054);
  flex: 1;
  flex-basis: 0%;
  margin: auto 0;
  font: 600 14px/1 Inter, sans-serif;
  
  @media (max-width: 991px) {
    max-width: 100%;
    flex-wrap: wrap;
  }
`;