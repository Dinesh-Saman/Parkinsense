import psutil
import os
import time

def kill_port(port):
    killed = False
    for conn in psutil.net_connections():
        if conn.laddr.port == port:
            try:
                proc = psutil.Process(conn.pid)
                print(f"Killing process {proc.name()} (PID: {proc.pid}) on port {port}...")
                proc.terminate()
                proc.wait(timeout=3)
                killed = True
            except psutil.NoSuchProcess:
                pass
            except psutil.AccessDenied:
                print(f"Access denied to kill PID {conn.pid}")
            except Exception as e:
                print(f"Error killing PID {conn.pid}: {e}")
    return killed

if __name__ == "__main__":
    if kill_port(5005):
        print("Server successfully killed.")
    else:
        print("No process found on port 5005.")
