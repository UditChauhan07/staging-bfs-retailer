import LoaderV2 from "./v2"

const LoaderV3 = ({text}) => {
    if(text){
        return (<div className="d-grid place-content-center" style={{ height: '40vh' }}><LoaderV2 height={175} width={175} style={{ margin: 'auto' }} /><br /><p className="m-auto">{text}</p></div>)
    } return null;
}
export default LoaderV3