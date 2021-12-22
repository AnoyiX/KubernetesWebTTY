import { useEffect, useState } from 'react'
import Button from '../components/Button'
import Select from '../components/Select'
import { Pod, TerminalConnectStatus } from '../interfaces'
import http from '../utils/http'
import dynamic from 'next/dynamic'

const KubeTerminal = dynamic(() => import('../components/KubeTerminal'), {
  ssr: false
})

const IndexPage = () => {

  const [namespace, setNamespace] = useState('')
  const [namespaces, setNamespaces] = useState<string[]>([])
  const [pod, setPod] = useState<Pod>({ name: '', containers: [] })
  const [pods, setPods] = useState<Pod[]>([])
  const [container, setContainer] = useState<string>()
  const [containers, setContainers] = useState<string[]>([])
  const [status, setStatus] = useState<TerminalConnectStatus>(TerminalConnectStatus.CLOSED)
  const [ternimal, setTerminal] = useState({ namespace: '', pod: '', container: '' })

  // Load namespaces and select the first one
  useEffect(() => {
    http.get(`/api/k8s/namespaces`).then(data => {
      setNamespaces(data)
      data.length > 0 && setNamespace(data[0])
    }).catch(err => console.error(err))
  }, [])

  // After namespace changed, load pods and select the first one
  useEffect(() => {
    namespace.length > 0 && http.get(`/api/k8s/namespace/${namespace}/pods`).then(data => {
      setPods(data)
      data.length > 0 && setPod(data[0])
    }).catch(err => console.error(err))
  }, [namespace])

  // After pod changed, select the first container
  useEffect(() => {
    setContainers(pod.containers)
    pod.containers.length > 0 && setContainer(pod.containers[0])
  }, [pod])

  const getConnectButtonStyle = (status: TerminalConnectStatus) => {
    if (status == TerminalConnectStatus.CONNECTING) return 'bg-blue-500 cursor-not-allowed'
    if (status == TerminalConnectStatus.CONNECTED) return 'bg-red-600 hover:bg-red-500'
    return 'bg-blue-600 hover:bg-blue-500'
  }

  const getConnectButtonContent = (status: TerminalConnectStatus) => {
    if (status == TerminalConnectStatus.CONNECTING) return 'Connecting'
    if (status == TerminalConnectStatus.CONNECTED) return 'Close'
    return 'Connect'
  }

  const onClick = () => {
    if (status == TerminalConnectStatus.CLOSED) setTerminal({ namespace, pod: pod.name, container })
    if (status == TerminalConnectStatus.CONNECTED) setTerminal({ namespace: '', pod: '', container: '' })
  }

  return (
    <div className='bg-gray-200 h-screen w-screen p-8 flex flex-row space-x-6'>
      <div className='bg-white w-96 h-full rounded-lg shadow p-4 flex flex-col justify-between'>
        <div>
          <div className='text-gray-500 font-normal p-2'>Namesapce</div>
          <Select value={namespace} options={namespaces} onChange={setNamespace} />
          <div className='text-gray-500 font-normal p-2 mt-4'>Pod</div>
          <Select value={pod} options={pods} onChange={setPod} valueKey={value => value.name} />
          <div className='text-gray-500 font-normal p-2 mt-4'>Container</div>
          <Select value={container} options={containers} onChange={setContainer} />
          <div className='mt-6'>
            <Button
              className={`inline-flex items-center justify-center w-full text-white rounded-lg font-medium p-2 ${getConnectButtonStyle(status)}`}
              loadingClassName='mr-3 h-5 w-5 text-white'
              loading={status == TerminalConnectStatus.CONNECTING}
              onClick={onClick}
            >
              {
                getConnectButtonContent(status)
              }
            </Button>
          </div>
        </div>

        <a className='w-full flex flex-row justify-center items-center my-2 text-gray-400' href='https://github.com/ChinaSilence/KubernetesWebTTY' target='_blank'>
          <svg className='h-5 w-5 mr-2' viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"><path d="M850.346667 155.008a42.666667 42.666667 0 0 0-22.741334-23.509333c-8.704-3.754667-85.717333-33.322667-200.32 39.168H396.714667c-114.773333-72.618667-191.701333-42.922667-200.32-39.168a42.88 42.88 0 0 0-22.741334 23.466666c-26.197333 66.218667-18.048 136.448-7.850666 176.896C134.272 374.016 128 413.098667 128 469.333333c0 177.877333 127.104 227.882667 226.730667 246.272a189.568 189.568 0 0 0-13.013334 46.549334A44.373333 44.373333 0 0 0 341.333333 768v38.613333c-19.498667-4.138667-41.002667-11.946667-55.168-26.112C238.08 732.416 188.330667 682.666667 128 682.666667v85.333333c25.002667 0 65.365333 40.362667 97.834667 72.832 51.029333 51.029333 129.066667 55.253333 153.386666 55.253333 3.114667 0 5.376-0.085333 6.528-0.128A42.666667 42.666667 0 0 0 426.666667 853.333333v-82.090666c4.266667-24.746667 20.224-49.621333 27.946666-56.362667a42.666667 42.666667 0 0 0-23.125333-74.581333C293.333333 624.554667 213.333333 591.488 213.333333 469.333333c0-53.12 5.632-70.741333 31.573334-99.285333 11.008-12.117333 14.08-29.568 7.978666-44.8-4.821333-11.904-18.773333-65.450667-6.485333-117.546667 20.650667-1.578667 59.904 4.565333 113.706667 40.96C367.104 253.44 375.466667 256 384 256h256a42.666667 42.666667 0 0 0 23.936-7.338667c54.016-36.522667 92.970667-41.770667 113.664-41.130666 12.330667 52.224-1.578667 105.770667-6.4 117.674666a42.666667 42.666667 0 0 0 8.021333 44.928C805.077333 398.464 810.666667 416.085333 810.666667 469.333333c0 122.581333-79.957333 155.52-218.069334 170.922667a42.666667 42.666667 0 0 0-23.125333 74.709333c19.797333 17.066667 27.861333 32.469333 27.861333 53.034667v128h85.333334v-128c0-20.437333-3.925333-38.101333-9.770667-53.12C769.92 695.765333 896 643.712 896 469.333333c0-56.362667-6.272-95.530667-37.76-137.514666 10.197333-40.405333 18.261333-110.506667-7.893333-176.810667z" fill="currentColor"></path></svg>
          <span className='text-sm'>KubernetesWebTTY</span>
        </a>
      </div>

      <div className='bg-gray-900 flex flex-1 flex-col h-full rounded-lg shadow shadow-white'>
        <div className='w-full flex flex-row justify-between items-center p-2'>
          <div className='flex flex-row space-x-2 pl-2'>
            <span className='bg-red-500 w-3 h-3 rounded-full'></span>
            <span className='bg-yellow-500 w-3 h-3 rounded-full'></span>
            <span className='bg-green-500 w-3 h-3 rounded-full'></span>
          </div>
          <div>
            <span className='text-gray-500'>Terminal</span>
          </div>
          <div></div>
        </div>
        <div className='flex-1 p-2'>
          <KubeTerminal className='w-full h-full' {...ternimal} changeStatus={setStatus} />
        </div>
      </div>
    </div>
  )

}

export default IndexPage