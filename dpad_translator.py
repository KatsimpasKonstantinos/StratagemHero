import sys
import time

import hid
from evdev import uinput, ecodes as e

# scan  for gamepad
gamepad = None
while not gamepad:
    try:
        gamepad = hid.Device(0x0810, 0xe501)
        gamepad.nonblocking = True
        print('connected.')
    except hid.HIDException:
        time.sleep(0.5)
        sys.stdout.write('.')

capabilities = {
    e.EV_KEY: [
        e.KEY_W, e.KEY_A, e.KEY_S, e.KEY_D
    ]
}

last_report = None
with uinput.UInput(capabilities) as ui:
    while True:
        report = gamepad.read(64,timeout=10)
        if not report or report == last_report:
            continue
        last_report = report
        keys_up_down = report[4]
        keys_left_right = report[3]
        if keys_up_down != 127:
            ui.write(e.EV_KEY, e.KEY_W if keys_up_down == 0 else e.KEY_S, 1)
            ui.write(e.EV_KEY, e.KEY_W if keys_up_down == 0 else e.KEY_S, 0)
        if keys_left_right != 127:
            ui.write(e.EV_KEY, e.KEY_A if keys_left_right == 0 else e.KEY_D, 1)
            ui.write(e.EV_KEY, e.KEY_A if keys_left_right == 0 else e.KEY_D, 0)
        ui.syn()
