const TitleSubTitle = ({title, subTitle, titleStyle, subTitleStyle}) => {
    return(
        <div>
            <h4 className={`text-primary text-base uppercase ${subTitleStyle}`}>{subTitle}</h4>
            <h2 className={`text-[#071c35] text-[1.75rem] md:text-[2.625rem] font-semibold ${titleStyle}`}>{title}</h2>
        </div>
    )
}

export default TitleSubTitle;