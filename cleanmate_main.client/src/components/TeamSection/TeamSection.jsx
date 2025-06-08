import React from 'react'
import { Link } from 'react-router-dom'
import Team from '../../api/team'

const ClickHandler = () => {
    window.scrollTo(10, 0);
}

const TeamSection = (props) => {
    return (
        <section className="wpo-team-section section-padding">
            <div className="container">
                <div className="row align-items-center justify-content-center">
                    <div className="col-lg-5">
                        <div className="wpo-section-title">
                            <h2>Nhân viên dọn dẹp</h2>
                            <p>Đội ngũ nhân viên dọn dẹp chuyên nghiệp, tận tâm, mang lại không gian sạch sẽ và an toàn với kỹ năng cao.</p>
                        </div>
                    </div>
                </div>
                <div className="wpo-team-wrap">
                    <div className="row">
                        {Team.map((team, aitem) => (
                            <div className="col col-lg-6 col-md-12 col-12" key={aitem}>
                                <div className="wpo-team-item">
                                    <div className="wpo-team-img">
                                        <img
                                            src={team.tImg}
                                            alt={team.name}
                                            style={{
                                                width: '100%',
                                                objectFit: 'contain',
                                            }}
                                        />
                                    </div>
                                    <div className="wpo-team-text">
                                        <span>{team.title}</span>
                                        <h2><Link onClick={ClickHandler} to={`/team-single/${team.Id}`}>{team.name}</Link></h2>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default TeamSection;