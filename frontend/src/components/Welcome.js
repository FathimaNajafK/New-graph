import React, { useState, useEffect,useContext } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Welcome.css";
import { AppContext } from "../App";
import backendBaseUrl from "./config";

function Welcome() {
    const location = useLocation();
    const navigate = useNavigate();
    const { name } = location.state ? location.state : "";
    const [output, setOutput] = useState("");
    const [permissions, setPermissions] = useState({});
    const [showInputSide, setShowInputSide] = useState(false);
    const [showGraphInput, setShowGraphInput] = useState(false);
    const [GraphType,setGraphType] = useState("")
    const [xplot, setXplot] = useState(0);
    const [yplot, setYplot] = useState(0);
    const [Slope, setSlope] = useState(0);
    const [Intercept, setIntercept] = useState(0);
    const [Xmin, setXmin] = useState(0);
    const [Xmax, setXmax] = useState(0);
    const [coordinates, setCoordinates] = useState([]);
    const {setUserLogged } = useContext(AppContext);


    useEffect(() => {
        const fetchPermissions = async () => {
            try {
                const response = await axios.get(`${backendBaseUrl}/permissions/${name}`);
                console.log("Fetched permissions:", response.data.permissions);
                setPermissions(response.data.permissions);
            } catch (error) {
                console.error("Error fetching permissions:", error);
            }
        };

        fetchPermissions();
    }, []);

    const fetchScriptOutput = async (script) => {
        
        console.log(script)
        let ApiQuery = ""
        if (script == "GraphScript"){ 
            let coordinateString = dataChanger();
            ApiQuery = `script3?name=${name}&xplot=${coordinateString[0]}&yplot=${coordinateString[1]}`
        }
        else if(script == "CustomScript"){
            let PassScript = "script3"
            if (GraphType == "Simple Plot"){PassScript = "simpleplot"}
            else if (GraphType == "Browser Plot"){ PassScript = "browserplot"}
            let JsonData = {"name": name,"slope": Slope,"intercept": Intercept,"xmin": Xmin,"xmax": Xmax}
            ApiQuery = `${PassScript}?name=${name}&jsondata=${JSON.stringify(JsonData)}`
        }
        else (ApiQuery= `${script}?name=${name}`)

        try {
            const response = await axios.get(`${backendBaseUrl}/run-script/${ApiQuery}`);
            console.log(response);
            if(response.data.output && response.data.output.includes('.html')){
                window.open(`${backendBaseUrl}/Images/${response.data.output}`, '_blank');
            }
            setOutput(response.data.output);
            setShowInputSide(false);
            setShowGraphInput(false)
        } catch (error) {
            console.error("Error fetching script output:", error);
            setOutput("Error fetching script output");
        }
    };

    const addDataToFunction = () => {
        setCoordinates(coordinates => [...coordinates, [xplot, yplot]]);
        setXplot(0);
        setYplot(0);
    };

    const dataChanger = () => {
        let xvalues = [];
        let yvalues = [];
        for (let i = 0; i < coordinates.length; i++) {
            xvalues.push(coordinates[i][0]);
            yvalues.push(coordinates[i][1]);
        }
        setCoordinates([]);
        return [xvalues.join(":"), yvalues.join(":")];
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        sessionStorage.removeItem('user');
        setUserLogged(false)
        navigate("/");
    };

    const hasPermissions = permissions.script1_enabled || permissions.script2_enabled || permissions.script3_enabled || permissions.simpleplot_enabled || permissions.browserplot_enabled;

    return (
        <div className="welcome-container">
            <div className="welcome-header">
                <button className="logout-button" onClick={handleLogout}>Logout</button>
            </div>
            <div className="message-box">
                <h1>Welcome {name}</h1>
            </div>
            {hasPermissions && (
                <div className="button-box">
                    {permissions.script1_enabled && (
                        <button onClick={() => fetchScriptOutput('script1')}>
                            Script 1
                        </button>
                    )}
                    {permissions.script2_enabled && (
                        <button onClick={() => fetchScriptOutput('script2')}>
                            Script 2
                        </button>
                    )}
                    {permissions.script3_enabled && (
                        <button onClick={() => (setShowGraphInput(false),setShowInputSide(true))}>
                            Script 3
                        </button>
                    )}
                    {permissions.simpleplot_enabled && (
                        <button onClick={() => (setShowGraphInput(true),setGraphType("Simple Plot"),setShowInputSide(false))}>
                            Simple Plot
                        </button>
                    )}
                    {permissions.browserplot_enabled && (
                        <button onClick={() => (setShowGraphInput(true),setGraphType("Browser Plot"),setShowInputSide(false))}>
                            Browser Plot
                        </button>
                    )}
                </div>
            )}
            {coordinates.map((data, index) => (
                <div key={index}>
                    ({data[0]}:{data[1]})
                </div>
            ))}

            {showInputSide && (
                <div className="button-box">
                    <label>
                        X :
                        <input type="number" value={xplot} onChange={(e) => setXplot(Number(e.target.value))} />
                    </label>
                    <label>
                        Y :
                        <input type="number" value={yplot} onChange={(e) => setYplot(Number(e.target.value))} />
                    </label>
                    <button onClick={addDataToFunction}>
                        Submit
                    </button>
                    <button
                        onClick={() => fetchScriptOutput('GraphScript')}
                        disabled={coordinates.length < 2}
                    >
                        Generate graph
                    </button>
                    {coordinates.length < 2 && (
                        <div className="alert-message">
                            Enter at least two coordinates for generating graph.
                        </div>
                    )}
                </div>
            )}

            {showGraphInput && (
                <div className="button-box">
                    <div className="alert-message">
                    {GraphType}
                        </div>
                    
                    <label>
                        Slop :
                        <input type="number" value={Slope} onChange={(e) => setSlope(Number(e.target.value))} />
                    </label>
                    <label>
                        Intercept :
                        <input type="number" value={Intercept} onChange={(e) => setIntercept(Number(e.target.value))} />
                    </label>
                    <label>
                        Xmin :
                        <input type="number" value={Xmin} onChange={(e) => setXmin(Number(e.target.value))} />
                    </label>
                    <label>
                        Xmax :
                        <input type="number" value={Xmax} onChange={(e) => setXmax(Number(e.target.value))} />
                    </label>
                    <button onClick={() => fetchScriptOutput('CustomScript')}>
                        Generate graph
                    </button>
                </div>
            )}

            {!showInputSide && !showGraphInput && 
                output ? (output.includes('.png') ? (
                    <div className="graphImg">
                        <img src={`${backendBaseUrl}/Images/${output}`} alt="Generated Plot" style={{ width: '400px' }} />
                    </div>
                ) : output.includes('.html') ? (
                     <div className="pre-output">
                     <pre>The image is opened in new tab</pre>
                 </div>
                ) : (
                    <div className="pre-output">
                        <pre>{output}</pre>
                    </div>
                )) : ''
            }
        </div>
    );
}

export default Welcome;
