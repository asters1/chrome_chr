#Requires AutoHotkey v2.0
#NoTrayIcon 
#SingleInstance Force
; 全局热键定义
$Browser_Home::
{
     Send("!{Home}")      
    return
}
$Browser_Back::
{
     Send("{a}")      
    return
}
$Volume_Down::
{
     Send("{m}")      
    return
}
$Volume_up::
{
     Send("{n}")      
    return
}
#HotIf WinActive("ahk_exe chrome.exe")

Up::
{
        Send("w")
        KeyWait("Up") 
        return
}
Down::
{
     Send("s")
    KeyWait("Down")  ; 等待物理按键释放，防止长按重复触发
    return
 }


