import React, { useEffect, useState } from 'react'
import Select from 'react-select';

const DiamonFields = ({ field, index, productTypes, handleFieldChange }) => {

//     const [selectedStoneType, setSelectedStoneType] = useState(null);
//     const [selectedstoneShape, setSelectedStoneShape] = useState(null);
//     const [selectedMm, setSelectedMm] = useState(null);
// // console.log(field,);

    // const handleFieldChange = (index, field, value) => {
        
    //     const newFields = [...fields];
    //     console.log(newFields,55, value);
    //     newFields[index][field] = value;
    //     console.log(newFields,57, value);
        
    //     setFields(newFields);
    //     if (field === 'stoneType') setSelectedStoneType(value?.value);
    //     if (field === 'stoneShape') setSelectedStoneShape(value?.value);
    //     if (field === 'mm') setSelectedMm(value?.value);  
        
    // };

    
    
    
        const [selectedStoneType, setSelectedStoneType] = useState(null);
        const [selectedStoneShape, setSelectedStoneShape] = useState(null);
        const [selectedMm, setSelectedMm] = useState(null);
    
        useEffect(() => {
            setSelectedStoneType(field.stoneType?.value || null);
            setSelectedStoneShape(field.stoneShape?.value || null);
            setSelectedMm(field.mm?.value || null);
        }, [field]);
    
        const handleChange = (fieldName, value) => {
            handleFieldChange(index, fieldName, value);
            if (fieldName === 'stoneType') setSelectedStoneType(value?.value);
            if (fieldName === 'stoneShape') setSelectedStoneShape(value?.value);
            if (fieldName === 'mm') setSelectedMm(value?.value);  
        };
    
        const nameOptions = productTypes?.map(type => ({ value: type.diamondType, label: type.diamondType }));
        const shapeOptions = selectedStoneType ? productTypes?.find(type => type.diamondType === selectedStoneType)?.diamondShape?.map(v => ({ value: v.name, label: v.name })) : [];
        const mmExtraxt = selectedStoneShape ? productTypes?.map(v => v?.diamondType === selectedStoneType && v?.diamondShape?.find(t => t?.name === selectedStoneShape)?.details?.map(d => d.mm)) : [];
        const mmOptions = mmExtraxt?.filter(v => v != false)?.[0]?.map(s => ({ value: s, label: s }))
    
        const caratWeightExtract = selectedStoneShape ? productTypes?.map(v => v?.diamondType === selectedStoneType && v?.diamondShape?.find(t => t?.name === selectedStoneShape)) : [];
        const caratWeight = caratWeightExtract?.filter(v => v != false)?.[0]?.details?.find(d => d.mm === selectedMm)?.carat_weight
    
        const qualityExtraxt = selectedStoneShape ? productTypes?.map(v => v?.diamondType === selectedStoneType && v?.diamondShape?.find(t => t?.name === selectedStoneShape)?.details?.map(d => d)) : [];
        const qualityOptions = qualityExtraxt?.filter(v => v != false)?.[0]?.map(({ mm, carat_weight, _id, ...rest }) => {
            return removeNullValues(rest);
        });

    
        const allKeys = [...new Set(qualityOptions?.flatMap(Object.keys))]?.map(s => ({ value: s, label: s }));

    
        function removeNullValues(obj) {
            return Object.fromEntries(Object.entries(obj).filter(([_, v]) => v !== null));
        }


    

    return (
        <div key={index} className="row mb-3">
            <div className="col-md-3 mb-3">
                <label htmlFor={`name-${index}`}>Stone Type</label>
                <Select
                    id={`name-${index}`}
                    options={nameOptions}
                    onChange={(option) => handleChange('stoneType', option)}
                    value={field.stoneType}
                    placeholder="Diamond"
                />
            </div>
            <div className="col-md-3 mb-3">
                <label htmlFor={`name-${index}`}>Stone Shape</label>
                <Select
                    id={`name-${index}`}
                    options={shapeOptions}
                    onChange={(option) => handleChange('stoneShape', option)}
                    value={field.stoneShape}
                    placeholder="Stone"
                />
            </div>
            <div className="col-md-3 mb-3">
                <label htmlFor={`name-${index}`}>Diamond Quality</label>
                <Select
                    id={`name-${index}`}
                    options={allKeys}
                    onChange={(option) => handleChange('quality', option)}
                    value={field.name}
                    placeholder="Diamond Quality"
                />
            </div>
            <div className="col-md-3 mb-3">
                <label htmlFor={`name-${index}`}>Stone Position</label>
                <Select
                    id={`name-${index}`}
                    options={[
                        {
                            value: 'Primary',
                            label: 'Primary',
                        },
                        {
                            value: 'side',
                            label: 'Side',
                        }
                        // {
                        //     value: 'corner',
                        //     label: 'Corner',
                        // },
                        // {
                        //     value: 'other',
                        //     label: 'Other',
                        // }
                    ]}
                    onChange={(option) => handleChange('position', option)}
                    value={field.name}
                    placeholder="Stone Position"
                />
            </div>
            <div className="col-md-3 mb-3">
                <label htmlFor={`mm-${index}`}>MM</label>
                <Select
                    id={`mm-${index}`}
                    options={mmOptions}
                    onChange={(option) => handleChange('mm', option)}
                    value={field.mm}
                    placeholder=" MM"
                />
            </div>
            <div className="col-md-2 mb-3">
                <label htmlFor={`weight-${index}`}>Carat Weight</label>
                <input
                    type="text"
                    id={`weight-${index}`}
                    className="form-control"
                    value={caratWeight}
                    placeholder='Carat Weight'
                    readOnly
                />
            </div>
            <div className="col-md-2 mb-3">
                <label htmlFor={`pice-${index}`}>Pice</label>
                <input
                    type="text"
                    id={`pice-${index}`}
                    className="form-control"
                    value={field.pice}
                    onChange={event => handleChange('pice', event.target.value)}
                />
            </div>
        </div>
    )
}

export default DiamonFields
