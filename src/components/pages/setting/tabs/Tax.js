import React from 'react'
import SettingTab from '../SettingTab'

const Tax = () => {
    return (
        <>
            <div className="main-content-inner">
                <div className="grid grid-cols-6 gap-x-2 grid-flow-row ">
                    <SettingTab />
                    <div className="col-span-4">
                        <div>
                            <div className="card shadow">
                                <div className="card-section border-b box-border">
                                    <div className="flex justify-between card-section-header mb-1">
                                        <h3 className="card-session-title">Tax</h3>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Tax
