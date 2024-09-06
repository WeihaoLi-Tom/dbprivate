import React, { useState, useEffect, useRef } from 'react';
import "./Wall.css";

const westWallBricks = {
    // Row A
    A5: "011", A11: "027", A15: "044", A16: "052", A18: "065", A22: "090", A25: "109",      
    // Row B
    B7: "016", B11: "028", B13: "036", B15: "045", B17: "059", B18: "066", B20: "079", B21: "083", B22: "091", B24: "103", B26: "117", 
    // Row C
    C4: "007", C5: "012", C10: "023", C12: "030", C13: "037", C16: "053", C21: "084", C23: "097", C24: "104", C25: "110", 
    // Row D
    D7: "017", D10: "024", D13: "038", D17: "060", D18: "067", D19: "073", D23: "098", D26: "118", 
    // Row E
    E2: "002", E3: "005", E8: "019", E15: "046", E17: "061", E19: "074", E20: "080", E21: "085", E22: "092", E24: "105", E25: "111", E26: "119", 
    // Row F
    F6: "014", F9: "021", F12: "031", F14: "040", F15: "047", F16: "054", F18: "068", F19: "075", F21: "086", F23: "099", F24: "106", F25: "112", F26: "120",
    // Row G
    G1: "001", G3: "006", G4: "008", G7: "018", G11: "029", G14: "041", G16: "055", G17: "062", G18: "069", G20: "081", G22: "093", G25: "113",
    // Row H
    H2: "003", H4: "009", H8: "020", H12: "032", H15: "048", H17: "063", H21: "087", H22: "094", H23: "100", H26: "121",
    // Row I
    I10: "025", I2: "033", I13: "039", I15: "049", I16: "056", I18: "070", I19: "076", I22: "095", I23: "101", I25: "114", I26: "122",
    // Row J
    J6: "015", J12: "034", J14: "042", J17: "064", J18: "071", J20: "082", J24: "107", J25: "115",
    // Row K
    K2: "004", K4: "010", K10: "026", K15: "050", K16: "057", K18: "072", K19: "077", K21: "088", K23: "102", K26: "123",
    // Row L
    L5: "013", L9: "022", L12: "035", L14: "043", L15: "051", L16: "058", L19: "078", L21: "089", L22: "096", L24: "108", L25: "116"
};

const eastWallBricks = {
    // Row A
    A28: "126", A30: "137", A31: "144", A33: "159", A35: "172", A38: "190", A42: "210",      
    // Row B
    B27: "124", B29: "130", B31: "145", B33: "160", B36: "178", B39: "195", B45: "221",
    // Row C
    C28: "127", C29: "131", C31: "146", C32: "152", C34: "165", C37: "185", C40: "201", C43: "215",  
    // Row D
    D28: "128", D30: "138", D32: "153", D34: "166", D35: "173", D37: "186", D39: "196", D41: "206", D44: "216",
    // Row E
    E29: "132", E30: "139", E31: "147", E33: "161", E36: "179", E40: "202", E45: "222", 
    // Row F
    F27: "125", F30: "140", F31: "148", F33: "162", F34: "167", F35: "174", F36: "180", F38: "191", F39: "197", F42: "211", F24: "106", F25: "112", F26: "120",
    // Row G
    G29: "133", G32: "154", G34: "168", G36: "181", G38: "192", G40: "203", G44: "217", 
    // Row H
    H28: "129", H30: "141", H32: "155", H34: "169", H35: "175", H37: "187", H40: "204", H42: "212", H46: "224", 
    // Row I
    I29: "134", I30: "142", I31: "149", I32: "156", I35: "176", I36: "182", I39: "198", I41: "207", I42: "213", I44: "218", I47: "225",
    // Row J
    J29: "135", J31: "150", J33: "163", J34: "170", J36: "183", J37: "188", J39: "199", J41: "208", J44: "219", J45: "223",
    // Row K
    K30: "143", K32: "157", K34: "171", K35: "177", K37: "189", K38: "193", K40: "205", K42: "214", K47: "226", 
    // Row L
    L29: "136", L31: "151", L32: "158", L33: "164", L36: "184", L38: "194", L39: "200", L41: "209", L44: "220", 
};

const Wall = ({isWest}) => {
    const rows = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"];
    const [brickWall, setBrickWall] = useState({});
    const [columnNumber, setColumnNumber] = useState(0);

    useEffect(() => {
        if (isWest) {
            setBrickWall(westWallBricks);
            setColumnNumber(26);
        } else {
            setBrickWall(eastWallBricks);
            setColumnNumber(21);
        }
    }, [isWest]);
        
    const columns = Array.from({ length: columnNumber }, (_, i) => i + 1);

    const generateGrid = () => {
        const rows = [];
        const letters = "ABCDEFGHIJKL";

        for (let i = 0; i < 12; i++) { // 13��
            const bricks = [];

            for (let j = 1; j <= columnNumber; j++) { // 26��
                const brickLoc = `${letters[i]}${isWest ? j : j + 26}`;
                const brickId = brickWall[brickLoc];

                bricks.push(
                    <div
                        key={brickLoc}
                        className={`grid ${brickId? 'brick' : ''}`}
                    >
                        {brickId ? brickWall[brickLoc] : ''}
                    </div>
                );
            }

            rows.push(
                <div
                    key={letters[i]}
                    className='grid-row'
                >
                    <div className="row-label">
                        {letters[i]}
                    </div>
                    {bricks}
                </div>
            );
        }

        return rows;
    };

    return (
        <div className="wall-container">
            <h1 className="wall-header">{isWest ? "WEST WALL" : "EAST WALL"}</h1>
            <div className="grid-container">
                <div className="column-header">
                    <div></div> {/* Empty grid for alignment */}
                    {columns.map(col => (
                        <div key={col} className="column-header">
                            {col}
                        </div>
                    ))}
                </div>
                {generateGrid()}
            </div>
        </div>
    );
};

export default Wall;
export {westWallBricks, eastWallBricks};
