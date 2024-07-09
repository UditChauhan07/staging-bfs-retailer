import LoaderV2 from "./v2"

const LoaderV3 = ({text}) => {
    if(text){
        return (<div className="d-grid place-content-center" style={{ height: '40vh' }}><img height={280} width={160} src="/assets/loader.gif" /><br /><p className="m-auto">Please wait while we are geting details...</p></div>)
    } return null;
}
export default LoaderV3