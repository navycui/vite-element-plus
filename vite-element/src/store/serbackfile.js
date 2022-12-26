// package com.cesco.fs.consulting.service;

// import java.io.IOException;
// import java.util.ArrayList;
// import java.util.HashMap;
// import java.util.List;
// import java.util.Map;
// import java.util.Set;
// import java.util.concurrent.ConcurrentHashMap;
// import javax.websocket.OnClose;
// import javax.websocket.OnError;
// import javax.websocket.OnMessage;
// import javax.websocket.OnOpen;
// import javax.websocket.Session;
// import javax.websocket.server.PathParam;
// import javax.websocket.server.ServerEndpoint;
// import com.alibaba.fastjson.JSON;
// import com.alibaba.fastjson.JSONObject;

// import org.apache.commons.lang3.StringUtils;
// import org.springframework.stereotype.Component;
// import cn.hutool.log.Log;
// import cn.hutool.log.LogFactory;


// /**
//  * WebSocketServer
//  * @author zhengkai.blog.csdn.net
//  */
// @ServerEndpoint("/imserver/{sysId}/{userId}")
// @Component
// public class WebSocketServer {

//     static Log log=LogFactory.get(WebSocketServer.class);

//     /**静态变量，用来记录当前在线连接数。应该把它设计成线程安全的。*/
//     private static int onlineCount = 0;

//     /**concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。*/
//     private static ConcurrentHashMap<String,WebSocketServer> webSocketMap = new ConcurrentHashMap<>();

//     /**concurrent包的线程安全Set，用来存放每个客户端对应的MyWebSocket对象。*/
//     Map<String,ConcurrentHashMap<String,WebSocketServer>> roomMap = new HashMap<>();
//     /**与某个客户端的连接会话，需要通过它来给客户端发送数据*/
//     private Session session;

//     /**接收userId*/
//     private String userId="";

//     // 使用map来收集session，key为roomName，value为同一个房间的用户集合
//     private static final Map<String, Set<Session>> rooms = new ConcurrentHashMap<>();
//     //缓存session对应的用户
//     private static final Map<String, String> users = new ConcurrentHashMap<>();
//     private Integer uid;
//     private String roomId;
//     private String sysId;
//     /**
//      * 连接建立成功调用的方法*/
//     @OnOpen
//     public void onOpen(Session session,@PathParam("userId") String userId,@PathParam("sysId") String sysId) {
//         this.session = session;
//         this.userId=userId;
//         this.sysId = sysId;

//         if(webSocketMap.containsKey(userId)){
//             webSocketMap.remove(userId);
//             webSocketMap.put(userId,this);
//             roomMap.put(sysId, webSocketMap);
//             //加入set中
//         }else{
//             webSocketMap.put(userId,this);
//             roomMap.put(sysId, webSocketMap);
//             //加入set中
//             addOnlineCount();
//             //在线数加1
//         }
//         roomMap.forEach((strKey, strValue)->{
//             log.info("用户连接:"+strKey+",当前在线人数为:" + strValue.get(userId));
//         });
//         // log.info("用户连接:"+userId+",当前在线人数为:" + getOnlineCount());

//         try {
//             sendMessage("连接成功");
//         } catch (IOException e) {
//             log.error("用户:"+userId+",网络异常!!!!!!");
//         }
//     }

//     /**
//      * 连接关闭调用的方法
//      */
//     @OnClose
//     public void onClose() {
//         if(webSocketMap.containsKey(userId)){
//             webSocketMap.remove(userId);
//             //从set中删除
//             subOnlineCount();
//         }
//         log.info("用户退出:"+userId+",当前在线人数为:" + getOnlineCount());
//     }

//     /**
//      * 收到客户端消息后调用的方法
//      *
//      * @param message 客户端发送过来的消息*/
//     @OnMessage
//     public void onMessage(String message, Session session) {
//         log.info("用户消息:"+userId+",报文:"+message);
//         //可以群发消息
//         //消息保存到数据库、redis
//         if(StringUtils.isNotBlank(message)){
//             try {
                
//                 //解析发送的报文
//                 JSONObject jsonObject = JSON.parseObject(message);
//                 //追加发送人(防止串改)
//                 jsonObject.put("fromUserId",this.userId);
//                 String toUserId=jsonObject.getString("toUserId");
//                 //传送给对应toUserId用户的websocket
//                 if(StringUtils.isNotBlank(toUserId)&&webSocketMap.containsKey(toUserId)){
//                     webSocketMap.get(toUserId).sendMessage(jsonObject.toJSONString());
//                 }else{
//                     log.error("请求的userId:"+toUserId+"不在该服务器上");
//                     //否则不在这个服务器上，发送到mysql或者redis
//                 }
//             }catch (Exception e){
//                 e.printStackTrace();
//             }
//         }

//         // String[] arr = param.split(",");
//         // this.roomId = String.valueOf(arr[0]);
//         // this.uid= Integer.valueOf(arr[1]);
//         // User user = userService.getById(uid);
//         // Map a = (Map) JSON.parse(Util.base64Untie(user.getUserinfo()));

//         // ChatMessage chatMessage = new ChatMessage();
//         // chatMessage.setCreateTime(Util.getDate());
//         // chatMessage.setUserName(String.valueOf(a.get("nickName")));
//         // chatMessage.setUserId(uid);
//         // chatMessage.setAvatarUrl(String.valueOf(a.get("avatarUrl")));
//         // chatMessage.setTypes(StateUtil.ONE);
//         // chatMessage.setChatContent(Util.base64Plus(msg));
//         // chatMessage.setGroupId(Integer.valueOf(roomId));
//         // 此处应该有html过滤，进行数据加工
// //        msg = users.get(session.getId()) + ":" + msg;
//         // 接收到信息后进行广播
//         // chatMessageService.save(chatMessage);
//         // broadcast(roomId, JSON.toJSONString(this.getMap(chatMessage)));

//     }

//     /**
//      *
//      * @param session
//      * @param error
//      */
//     @OnError
//     public void onError(Session session, Throwable error) {
//         log.error("用户错误:"+this.userId+",原因:"+error.getMessage());
//         error.printStackTrace();
//     }
//     /**
//      * 实现服务器主动推送
//      */
//     public void sendMessage(String message) throws IOException {
//         this.session.getBasicRemote().sendText(message);
//     }


//     /**
//      * 发送自定义消息
//      * */
//     public static void sendInfo(String message,@PathParam("userId") String userId) throws IOException {
//         log.info("发送消息到:"+userId+"，报文:"+message);
//         if(StringUtils.isNotBlank(userId)&&webSocketMap.containsKey(userId)){
//             webSocketMap.get(userId).sendMessage(message);
//         }else{
//             log.error("用户"+userId+",不在线！");
//         }
//     }

//     // 按照房间名进行广播
//     private void broadcast(String roomId, String msg) {
//         rooms.get(roomId).forEach(s -> {
//             try {
//                 s.getBasicRemote().sendText(msg);
//             } catch (IOException e) {
//                 e.printStackTrace();
//             }
//         });
//     }

//     public static synchronized int getOnlineCount() {
//         return onlineCount;
//     }

//     public static synchronized void addOnlineCount() {
//         WebSocketServer.onlineCount++;
//     }

//     public static synchronized void subOnlineCount() {
//         WebSocketServer.onlineCount--;
//     }
// }