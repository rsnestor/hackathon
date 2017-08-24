import java.io.IOException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.Set;

import javax.websocket.EncodeException;
import javax.websocket.OnClose;
import javax.websocket.OnError;
import javax.websocket.OnMessage;
import javax.websocket.OnOpen;
import javax.websocket.Session;
import javax.websocket.server.ServerEndpoint;

@ServerEndpoint("/websocketendpoint")
public class WebsocketServer {
	
	private static List<Session> userSessions = new ArrayList<Session>();
	
	@OnOpen
	public  void  onOpen(Session session){
		System.out.println("Open Connection ...");
		if(!userSessions.contains(session.getId()))
				userSessions.add(session);		
	}
	
	@OnClose
	public  void onClose(Session session){
		System.out.println("Close Connection ...");
		for (Iterator<Session> i = userSessions.iterator(); i.hasNext();) {
		    Session element = i.next();
		    if (element.getId().equals(session.getId())) {
		        i.remove();
		    }
		}
		userSessions.remove(session);	
		broadcastMessageForCount();
	}
	
	@OnMessage
	public void onMessage(String message, Session session){
		if(message.equalsIgnoreCase("count")){
			System.out.println("return count");
			
			broadcastMessageForCount();
		}else{
		System.out.println("Message from the client: " + message);
		
		
		broadcastMessage("Property " + message + "is now under contract", session);
		}
			
	}


	@OnError
	public void onError(Throwable e){
		e.printStackTrace();
	}

	public static  void broadcastMessage(String message, Session session)  {
		 for (Session s : userSessions) {
		  if (s.isOpen() && s.getId() != session.getId()) {
		   try {			  			
		    s.getBasicRemote().sendText(message);
		    System.out.println("done with broadcast");	
		   } catch (IOException e) {
		    e.printStackTrace();
		   }
		  }
		 }
		}
	
	public static  void broadcastMessageForCount()  {
		 for (Session s : userSessions) {
		  if (s.isOpen()) {
		   try {			  			
		    s.getBasicRemote().sendText("" + userSessions.size() + "");
		    System.out.println("done with broadcast for count");	
		   } catch (IOException e) {
		    e.printStackTrace();
		   }
		  }
		 }
		}
}
