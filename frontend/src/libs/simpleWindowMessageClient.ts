export interface SimpleWindowMessageClientData<T> {
  type: string,
  message: T
}

export interface SimpleWindowMessageClientResponseData<T> {
  event: MessageEvent<SimpleWindowMessageClientData<T>>
  message: T
  response: (responseData: unknown)=>void
}

export default class SimpleWindowMessageClient {
  private targetWindow: Window
  private fromWindow: Window

  constructor(targetWindow: Window, fromWindow?: Window) {
    this.targetWindow = targetWindow

    this.fromWindow = fromWindow ? fromWindow : targetWindow
  }

  setTargetWindow(window: Window) {
    this.targetWindow = window
  }

  setFromWindow(window: Window) {
    this.fromWindow = window
  }

  echo<ReceiveType>(type: string, message: unknown, timeout?: number) {
    const waitPromise = this.getOnce<ReceiveType>(type, timeout)

    this.send(type, message)

    return waitPromise
  }

  getOnce<T>(type: string, timeout?: number): Promise<SimpleWindowMessageClientResponseData<T>> {
    const fromWindow = this.fromWindow

    return new Promise<SimpleWindowMessageClientResponseData<T>>((resolve, reject) => {
      let timeoutId: NodeJS.Timeout

      const windowMessageHandler = (event: MessageEvent<SimpleWindowMessageClientData<T>>) => {
        if (event.data.type === type) {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId)
          }
          fromWindow.removeEventListener('message', windowMessageHandler)

          resolve({
            event,
            message: event.data.message,
            response: responseData => this.send(type, responseData),
          })
        }
      }

      if (timeout) {
        timeoutId = setTimeout(()  => {
          fromWindow.removeEventListener('message', windowMessageHandler)
          reject()
        }, timeout)
      }

      fromWindow.addEventListener('message', windowMessageHandler)
    })
  }

  send(type: string, message: unknown, options?: WindowPostMessageOptions) {
    this.targetWindow.postMessage({
      type,
      message,
    }, options)
  }
}
